import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const SUBSCRIBERS_FILE = path.join(process.cwd(), "..", "subscribers.json");

interface Subscriber {
  email: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  is_pro: boolean;
  created_at: string;
}

function readSubscribers(): Subscriber[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function writeSubscribers(subscribers: Subscriber[]): void {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  const subscribers = readSubscribers();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email ?? "";
    const stripe_customer_id =
      typeof session.customer === "string" ? session.customer : "";
    const stripe_subscription_id =
      typeof session.subscription === "string" ? session.subscription : "";

    const existing = subscribers.find(
      (s) => s.stripe_customer_id === stripe_customer_id
    );
    if (existing) {
      existing.is_pro = true;
      existing.stripe_subscription_id = stripe_subscription_id;
    } else {
      subscribers.push({
        email,
        stripe_customer_id,
        stripe_subscription_id,
        is_pro: true,
        created_at: new Date().toISOString(),
      });
    }
    writeSubscribers(subscribers);
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const stripe_customer_id =
      typeof subscription.customer === "string" ? subscription.customer : "";
    const existing = subscribers.find(
      (s) => s.stripe_customer_id === stripe_customer_id
    );
    if (existing) {
      existing.is_pro = false;
    }
    writeSubscribers(subscribers);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
