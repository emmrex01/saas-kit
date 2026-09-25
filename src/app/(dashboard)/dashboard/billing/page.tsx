import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-1 text-muted-foreground">Manage your plan and payments.</p>
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed bg-background p-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
          <CreditCard className="size-6" />
        </span>
        <p className="mt-4 font-medium">Payments coming next</p>
        <p className="mt-1 text-sm text-muted-foreground">Stripe and Paystack plans will appear here.</p>
      </div>
    </div>
  );
}