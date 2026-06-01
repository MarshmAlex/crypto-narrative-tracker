import { NextRequest, NextResponse } from "next/server";
import { getSubscriber, upsertSubscriber, setProStatus } from "@/lib/db";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email ?? "";
    const stripe_customer_id = typeof session.customer === "string" ? session.customer : "";
    const stripe_subscription_id = typeof session.subscription === "string" ? session.subscription : "";
    upsertSubscriber({
      email,
      stripe_customer_id,
      stripe_subscription_id,
      is_pro: 1,
      created_at: new Date().toISOString(),
    });
  } else if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const stripe_customer_id = typeof sub.customer === "string" ? sub.customer : "";
    const existing = getSubscriber(stripe_customer_id);
    if (existing) setProStatus(stripe_customer_id, 0);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
