import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const perks = [
  "Secure login & user accounts",
  "Stripe + Paystack payments",
  "Admin dashboard included",
];

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 animate-pulse rounded-full bg-violet-600/40 blur-3xl" />
        <div
          className="pointer-events-none absolute -bottom-32 -right-16 size-[28rem] animate-pulse rounded-full bg-fuchsia-500/30 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <Link href="/" className="relative flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="size-5" />
          </span>
          SaaS Kit
        </Link>

        <div className="relative space-y-8">
          <h2 className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-semibold leading-tight tracking-tight duration-700">
            Launch your SaaS
            <br />
            <span className="bg-linear-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              in days, not months.
            </span>
          </h2>
          <ul className="space-y-3">
            {perks.map((perk, i) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-white/80 animate-in fade-in slide-in-from-left-4 duration-500"
                style={{ animationDelay: `${300 + i * 150}ms`, animationFillMode: "both" }}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-4" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} SaaS Kit. All rights reserved.
        </p>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-6 duration-500">
          <Link href="/" className="mb-10 flex items-center gap-2 font-semibold lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Sparkles className="size-4" />
            </span>
            SaaS Kit
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </section>
    </main>
  );
}