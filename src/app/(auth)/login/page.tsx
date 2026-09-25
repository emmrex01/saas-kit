import Link from "next/link";
import { login } from "../actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { EmailField, FormError } from "@/components/auth/fields";
import { PasswordField } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your dashboard."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form action={login} className="grid gap-5">
        <FormError message={error} />
        <EmailField />
        <PasswordField />
        <SubmitButton>Log in</SubmitButton>
      </form>
    </AuthShell>
  );
}