"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isValidEmail, requestOtp } from "@/lib/auth";

type CredentialsStepProps = {
  onSent: (email: string) => void;
};

export function CredentialsStep({ onSent }: CredentialsStepProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      await requestOtp(email.trim());
      onSent(email.trim());
    } catch {
      setError("We couldn't send the code. Please try again.");
      setPending(false);
    }
  }

  return (
    <div>
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Welcome back</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Sign in with your campus account to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5" noValidate>
        <div className="grid gap-1.5">
          <label htmlFor="login-email" className="text-[12.5px] font-medium">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(null);
              }}
              placeholder="you@school.edu.np"
              aria-invalid={Boolean(error)}
              className="h-11 w-full rounded-xl border border-input bg-transparent pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-ring/40 focus:border-ring focus:ring-3 focus:ring-ring/25 dark:bg-input/20"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-[12.5px] font-medium">
              Password
            </label>
            <button
              type="button"
              className="text-[12px] font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              aria-invalid={Boolean(error)}
              className="h-11 w-full rounded-xl border border-input bg-transparent pl-10 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-ring/40 focus:border-ring focus:ring-3 focus:ring-ring/25 dark:bg-input/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="size-3.5 cursor-pointer accent-primary"
          />
          Keep me signed in
        </label>

        <div aria-live="polite" className="min-h-[17px]">
          {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full gap-2 rounded-xl text-sm font-medium"
        >
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Sending code
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
