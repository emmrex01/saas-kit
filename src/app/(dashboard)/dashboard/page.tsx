import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Circle, CreditCard, TrendingUp, Users, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const stats = [
  { label: "Total revenue", value: "$0.00", change: "+0%", icon: TrendingUp, color: "from-violet-500 to-violet-600" },
  { label: "Active users", value: "1", change: "+100%", icon: Users, color: "from-sky-500 to-blue-600" },
  { label: "Subscriptions", value: "0", change: "+0%", icon: CreditCard, color: "from-emerald-500 to-green-600" },
  { label: "API calls", value: "0", change: "+0%", icon: Zap, color: "from-amber-500 to-orange-500" },
];

const week = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 60 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 70 },
];

const checklist = [
  { label: "Create your account", done: true },
  { label: "Set up payments", done: false },
  { label: "Customize your branding", done: false },
  { label: "Deploy to production", done: false },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = user?.email?.split("@")[0] ?? "there";
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white animate-in fade-in slide-in-from-bottom-4 duration-500 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 size-64 animate-pulse rounded-full bg-violet-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <p className="relative text-sm text-white/60">Welcome back 👋</p>
        <h1 className="relative mt-1 text-2xl font-semibold capitalize tracking-tight sm:text-3xl">
          {name}
        </h1>
        <p className="relative mt-2 max-w-md text-sm text-white/70">
          Here's what's happening with your product today.
        </p>
        <Link
          href="/dashboard/billing"
          className="group relative mt-5 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:shadow-lg hover:shadow-violet-500/30"
        >
          View plans
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, color }, i) => (
          <div
            key={label}
            className="group rounded-2xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span
                className={`flex size-9 items-center justify-center rounded-xl bg-linear-to-br ${color} text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6`}
              >
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-emerald-600">{change} this month</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-2xl border bg-background p-6 lg:col-span-2 animate-in fade-in duration-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Weekly activity</h2>
              <p className="text-sm text-muted-foreground">Sample data. Connect your own later.</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
              +24%
            </span>
          </div>
          <div className="mt-8 flex h-48 items-end gap-3">
            {week.map(({ day, value }, i) => (
              <div key={day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="rounded-md bg-foreground px-1.5 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                  {value}
                </span>
                <div
                  className="w-full origin-bottom rounded-t-lg bg-linear-to-t from-violet-600 to-fuchsia-400 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-300 group-hover:shadow-lg group-hover:shadow-violet-500/30 animate-in zoom-in-50"
                  style={{ height: `${value}%`, animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                />
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Getting started */}
        <div className="rounded-2xl border bg-background p-6 animate-in fade-in duration-700">
          <h2 className="font-semibold">Getting started</h2>
          <p className="text-sm text-muted-foreground">
            {doneCount} of {checklist.length} complete
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${(doneCount / checklist.length) * 100}%` }}
            />
          </div>
          <ul className="mt-5 space-y-2">
            {checklist.map(({ label, done }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-lg p-2 text-sm transition hover:bg-muted"
              >
                {done ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : (
                  <Circle className="size-5 text-muted-foreground" />
                )}
                <span className={done ? "text-muted-foreground line-through" : ""}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}