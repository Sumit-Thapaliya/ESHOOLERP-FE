"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { OTP_LENGTH, OTP_TTL_SECONDS, requestOtp, verifyOtp } from "@/lib/auth";
import { otpSchema, type OtpValues } from "@/lib/schemas/auth";
import { formatClock, useCountdown } from "@/hooks/use-countdown";
import { useAuthFlow } from "@/store/auth-flow-store";
import { toast } from "sonner";
import { useOptionalTenant } from "@/providers/tenant-provider";

type Status = "idle" | "verifying" | "error" | "success";

const RING = 94.2;
const EMPTY_CODE = Array.from({ length: OTP_LENGTH }, () => "");

// export function OtpStep() {
export function OtpStep({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  // const { slug } = useTenant();
  const slug = useOptionalTenant()?.slug ?? null;

  const email = useAuthFlow((s) => s.email);
  const expiresAt = useAuthFlow((s) => s.expiresAt);
  const resendAt = useAuthFlow((s) => s.resendAt);
  const refreshTimers = useAuthFlow((s) => s.refreshTimers);
  const backToCredentials = useAuthFlow((s) => s.backToCredentials);
  const clearFlow = useAuthFlow((s) => s.clearFlow);

  const expiresIn = useCountdown(expiresAt);
  const resendIn = useCountdown(resendAt);
  const [resending, setResending] = useState(false);
  const succeeded = useRef(false);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, submitCount },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: EMPTY_CODE },
  });

  const complete = useWatch({ control, name: "code" }).every(Boolean);

  const onSubmit = handleSubmit(async ({ code }) => {
    if (succeeded.current) return;
    const result = await verifyOtp(email, code.join(""), slug);
    if (!result.ok) {
      setError("root.server", { message: result.message });
      setValue("code", EMPTY_CODE);
      return;
    }
    succeeded.current = true;
    // toast.success("Redirecting to dashboard");
    toast.success("Welcome back!", {
      description: "Redirecting you to the dashboard…",
    });
    useAuthFlow.persist.clearStorage();
  });

  // redirect after success; the timeout is cleaned up if the component unmounts
  useEffect(() => {
    if (!isSubmitSuccessful) return;
    // const id = window.setTimeout(() => router.replace("/dashboard"), 550);
    const id = window.setTimeout(() => router.replace(redirectTo), 550);
    return () => window.clearTimeout(id);
    // }, [isSubmitSuccessful, router]);
  }, [isSubmitSuccessful, router, redirectTo]);

  // clear the saved flow only once we've actually left this step, so there's no flash
  // useEffect(
  //   () => () => {
  //     if (succeeded.current) clearFlow();
  //   },
  //   [clearFlow],
  // );

  async function resend() {
    if (resendIn > 0 || resending || isSubmitting) return;
    setResending(true);
    try {
      await requestOtp(email);
      refreshTimers();
      reset({ code: EMPTY_CODE });
    } finally {
      setResending(false);
    }
  }

  const status: Status = isSubmitting
    ? "verifying"
    : isSubmitSuccessful
      ? "success"
      : errors.root?.server
        ? "error"
        : "idle";

  const message = isSubmitting
    ? "Verifying your code…"
    : isSubmitSuccessful
      ? "Verified. Taking you in…"
      : (errors.root?.server?.message ?? "");

  const drain = expiresIn / OTP_TTL_SECONDS;

  return (
    <form onSubmit={onSubmit} noValidate>
      <Button
        type="button"
        variant={"ghost"}
        onClick={backToCredentials}
        className="-ml-1 mb-3 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Button>

      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
        Check your inbox
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative grid size-8.5 shrink-0 place-items-center">
          <svg viewBox="0 0 34 34" className="absolute inset-0 -rotate-90">
            <circle
              cx="17"
              cy="17"
              r="15"
              fill="none"
              strokeWidth="2.4"
              className="stroke-border"
            />
            <circle
              cx="17"
              cy="17"
              r="15"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - drain)}
              className={cn(
                "stroke-teal",
                expiresIn === 0 && "stroke-destructive",
              )}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <ShieldCheck className="size-3.5 text-muted-foreground" />
        </span>
        <span>
          <strong className="block text-[13px] font-semibold">
            {expiresIn === 0
              ? "Code expired"
              : `Code expires in ${formatClock(expiresIn)}`}
          </strong>
          <span className="block text-[11.5px] text-muted-foreground">
            {resendIn === 0
              ? "Didn't get it? Request a new one below"
              : `Resend available in ${formatClock(resendIn)}`}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput
              key={submitCount}
              value={field.value}
              onChange={field.onChange}
              onComplete={() => void onSubmit()}
              status={status}
              autoFocus
            />
          )}
        />
      </div>

      <div aria-live="polite" className="mt-2.5 min-h-4.25">
        <p
          className={cn(
            "text-[12px]",
            status === "error" && "text-destructive",
            status === "success" && "text-teal",
            (status === "idle" || status === "verifying") &&
              "text-muted-foreground",
          )}
        >
          {message}
        </p>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant={"ghost"}
          onClick={resend}
          disabled={resendIn > 0 || resending}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary hover:text-primary underline-offset-4 transition-opacity hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline disabled:opacity-70"
        >
          <RotateCcw className="size-3" />
          Resend code
        </Button>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful || !complete}
        className="mt-4 h-11 w-full gap-2 rounded-xl text-sm font-medium"
      >
        {status === "verifying" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Verifying
          </>
        ) : status === "success" ? (
          "Taking you in…"
        ) : (
          "Verify & continue"
        )}
      </Button>
    </form>
  );
}
