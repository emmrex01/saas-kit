import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your account details.</p>
      <div className="mt-6 rounded-2xl border bg-background p-6">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="mt-1 font-medium">{user?.email}</p>
        <div className="my-4 h-px bg-border" />
        <p className="text-sm text-muted-foreground">Member since</p>
        <p className="mt-1 font-medium">
          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
        </p>
      </div>
    </div>
  );
}