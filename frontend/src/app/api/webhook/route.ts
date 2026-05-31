import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
      return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function writeSubscribers(subscribers: Subscriber[]): void {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // Lazy import Stripe to avoid build-time instantiation
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia" as any,
  });

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const subscribers = readSubscribers();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email ?? "";
    const stripe_customer_id = typeof session.customer === "string" ? session.customer : "";
    const stripe_subscription_id = typeof session.subscription === "string" ? session.subscription : "";
    const existing = subscribers.find((s) => s.stripe_customer_id === stripe_customer_id);
    if (existing) {
      existing.is_pro = true;
      existing.stripe_subscription_id = stripe_subscription_id;
    } else {
      subscribers.push({ email, stripe_customer_id, stripe_subscription_id, is_pro: true, created_at: new Date().toISOString() });
    }
    writeSubscribers(subscribers);
  } else if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const stripe_customer_id = typeof sub.customer === "string" ? sub.customer : "";
    const existing = subscribers.find((s) => s.stripe_customer_id === stripe_customer_id);
    if (existing) existing.is_pro = false;
    writeSubscribers(subscribers);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
