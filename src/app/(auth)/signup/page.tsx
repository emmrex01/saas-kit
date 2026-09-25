import Link from "next/link";
import { signup } from "../actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { EmailField, FormError } from "@/components/auth/fields";
import { PasswordField } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started in less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form action={signup} className="grid gap-5">
        <FormError message={error} />
        <EmailField />
        <PasswordField showStrength />
        <SubmitButton>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}