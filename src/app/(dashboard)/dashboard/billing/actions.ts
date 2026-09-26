"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

async function getUserAndCustomer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .eq("provider", "stripe")
    .not("provider_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { user, customerId: data?.provider_customer_id as string | undefined };
}

export async function startCheckout() {
  const { user, customerId } = await getUserAndCustomer();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    ...(customerId ? { customer: customerId } : { customer_email: user.email }),
    client_reference_id: user.id,
    subscription_data: { metadata: { user_id: user.id } },
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
  });

  redirect(session.url!);
}

export async function openBillingPortal() {
  const { customerId } = await getUserAndCustomer();
  if (!customerId) redirect("/dashboard/billing");

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(portal.url);
}