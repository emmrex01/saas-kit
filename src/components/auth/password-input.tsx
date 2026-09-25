"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
const colors = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export function PasswordField({ showStrength = false }: { showStrength?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const strength = getStrength(value);

  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <div className="group relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          required
          minLength={6}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
          autoComplete={showStrength ? "new-password" : "current-password"}
          className="h-11 pl-10 pr-10 transition-shadow focus-visible:shadow-md"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="animate-in fade-in duration-300">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < strength ? colors[strength] : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{labels[strength]}</p>
        </div>
      )}
    </div>
  );
}