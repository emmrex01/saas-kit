import { Check, CheckCircle2, Info, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/auth/submit-button";
import { openBillingPortal, startCheckout } from "./actions";

const freeFeatures = ["1 project", "Basic analytics", "Community support"];
const proFeatures = ["Unlimited projects", "Advanced analytics", "Priority support", "All future updates"];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { success, canceled } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user!.id)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isPro = !!sub;
  const renews = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">Choose a plan that fits you.</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 animate-in fade-in slide-in-from-top-2 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          {isPro
            ? "Payment successful. Welcome to Pro! 🎉"
            : "Payment received. Your plan will update in a few seconds; refresh the page."}
        </div>
      )}
      {canceled && (
        <div className="flex items-center gap-3 rounded-xl border bg-muted p-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
          <Info className="size-5 shrink-0" />
          Checkout canceled. You haven't been charged.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="flex flex-col rounded-2xl border bg-background p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Free</h2>
            {!isPro && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">Current plan</span>
            )}
          </div>
          <p className="mt-4 text-4xl font-semibold tracking-tight">
            $0<span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 p-[2px] shadow-xl shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30">
          <div className="flex h-full flex-col rounded-[14px] bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="size-4 text-violet-600" />
                Pro
              </h2>
              <span className="rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-2.5 py-1 text-xs font-medium text-white">
                {isPro ? "Current plan" : "Most popular"}
              </span>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight">
              $19<span className="text-base font-normal text-muted-foreground">/month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="flex size-5 items-center justify-center rounded-full bg-violet-500/10 text-violet-600">
                    <Check className="size-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {isPro ? (
                <>
                  {renews && (
                    <p className="mb-3 text-center text-xs text-muted-foreground">Renews on {renews}</p>
                  )}
                  <form action={openBillingPortal}>
                    <SubmitButton>Manage billing</SubmitButton>
                  </form>
                </>
              ) : (
                <form action={startCheckout}>
                  <SubmitButton>Upgrade to Pro</SubmitButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}