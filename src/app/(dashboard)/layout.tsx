import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo, MobileNav, NavLinks } from "@/components/dashboard/nav";
import { UserMenu } from "@/components/dashboard/user-menu";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-background p-4 lg:flex">
        <div className="mb-8 px-2 pt-2">
          <Logo />
        </div>
        <NavLinks />
        <div className="relative mt-auto overflow-hidden rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 p-4 text-white">
          <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/20 blur-2xl" />
          <p className="relative text-sm font-semibold">Upgrade to Pro</p>
          <p className="relative mt-1 text-xs text-white/80">
            Unlock every feature and priority support.
          </p>
          <Link
            href="/dashboard/billing"
            className="relative mt-3 inline-block rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:scale-105"
          >
            Upgrade now
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            <span className="lg:hidden">
              <Logo />
            </span>
          </div>
          <UserMenu email={user.email ?? ""} />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}