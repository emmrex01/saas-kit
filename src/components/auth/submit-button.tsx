"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="group h-11 w-full text-base transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Please wait…
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Button>
  );
}