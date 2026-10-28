"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestOtp } from "@/lib/auth";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { useAuthFlow } from "@/store/auth-flow-store";
import { toast } from "sonner";

export function CredentialsStep() {
  const [showPassword, setShowPassword] = useState(false);
  const savedEmail = useAuthFlow((s) => s.email);
  const startOtp = useAuthFlow((s) => s.startOtp);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: savedEmail, password: "", remember: true },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await requestOtp(email);
      startOtp(email);
      toast.success("OTP sent successfull!", {
        description: "Verify your identity",
      })
    } catch {
      setError("root", {
        message: "We couldn't send the code. Please try again.",
      });
    }
  });

  return (
    <div>
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
        Welcome back
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Sign in with your campus account to continue.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3.5" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="login-email" className="text-[12.5px]">
            Email address
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@school.edu.np"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="h-11 rounded-xl pl-10 pr-3"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="text-[12px] text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-[12.5px]">
              Password
            </Label>
            <button
              type="button"
              className="text-[12px] cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className="h-11 rounded-xl pl-10 pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute cursor-pointer right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="login-password-error"
              className="text-[12px] text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
          <input
            type="checkbox"
             {...register("remember")}
            className="size-3.5 cursor-pointer accent-primary"
          />
          Keep me signed in
        </label>

        <div aria-live="polite" className="min-h-4.25">
          {errors.root && (
            <p className="text-[12px] text-destructive">{errors.root.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full gap-2 rounded-xl text-sm font-medium"
        >
          {isSubmitting ? (
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
