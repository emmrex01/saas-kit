@'
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

async function saveSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.user_id;
  if (!userId) return;

  const periodEnd = sub.items.data[0]?.current_period_end;
  const supabase = createAdminClient();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      provider: "stripe",
      provider_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      provider_subscription_id: sub.id,
      plan: "pro",
      status: sub.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "provider_subscription_id" }
  );

  if (error) throw error;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          await saveSubscription(await stripe.subscriptions.retrieve(subId));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await saveSubscription(event.data.object);
        break;
    }
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
'@ | Set-Content -Path "src\app\api\webhooks\stripe\route.ts" -Encoding utf8