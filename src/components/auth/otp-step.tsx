"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "cn";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import {
  DEMO_MODE,
  DEMO_OTP,
  OTP_LENGTH,
  OTP_TTL_SECONDS,
  RESEND_SECONDS,
  requestOtp,
  verifyOtp,
} from "@/lib/auth";
import { useTenant } from "@/providers/tenant-provider";
import { useBasePath } from "@/hooks/use-base-path";

type OtpStepProps = {
  email: string;
  onBack: () => void;
};

type Status = "idle" | "verifying" | "error" | "success";

const RING = 94.2;

export function OtpStep({ email, onBack }: OtpStepProps) {
  const router = useRouter();
  const base = useBasePath();
  const { slug } = useTenant();

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const submit = useCallback(
    async (code: string) => {
      if (status === "verifying" || status === "success") return;
      if (code.length !== OTP_LENGTH) return;

      setStatus("verifying");
      setMessage("Verifying your code…");

      const result = await verifyOtp(email, code, slug);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.message);
        setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
        setAttempt((value) => value + 1);
        return;
      }

      setStatus("success");
      setMessage("Verified. Taking you in…");
      window.setTimeout(() => router.replace(`${base}/dashboard`), 550);
    },
    [email, slug, status, router, base],
  );

  async function resend() {
    if (seconds > 0 || status === "verifying") return;
    setStatus("idle");
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setMessage("Sending a new code…");
    await requestOtp(email);
    setSeconds(RESEND_SECONDS);
    setAttempt((value) => value + 1);
    setMessage("A fresh code is on its way.");
  }

  const drain = seconds / OTP_TTL_SECONDS;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 mb-3 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Check your inbox</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="relative grid size-[34px] shrink-0 place-items-center">
          <svg viewBox="0 0 34 34" className="absolute inset-0 -rotate-90">
            <circle cx="17" cy="17" r="15" fill="none" strokeWidth="2.4" className="stroke-border" />
            <circle
              cx="17"
              cy="17"
              r="15"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - drain)}
              className={cn("stroke-teal", seconds === 0 && "stroke-destructive")}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <ShieldCheck className="size-3.5 text-muted-foreground" />
        </span>
        <span>
          <strong className="block text-[13px] font-semibold">
            {seconds === 0 ? "Code expired" : "Code expires soon"}
          </strong>
          <span className="block text-[11.5px] text-muted-foreground">
            {seconds === 0
              ? "Request a new one below"
              : `Resend available in 0:${String(seconds).padStart(2, "0")}`}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <OtpInput
          key={attempt}
          value={digits}
          onChange={setDigits}
          onComplete={submit}
          status={status}
          autoFocus={attempt === 0}
        />
      </div>

      <div aria-live="polite" className="mt-2.5 min-h-[17px]">
        <p
          className={cn(
            "text-[12px]",
            status === "error" && "text-destructive",
            status === "success" && "text-teal",
            (status === "idle" || status === "verifying") && "text-muted-foreground",
          )}
        >
          {message}
        </p>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={resend}
          disabled={seconds > 0}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary underline-offset-4 transition-opacity hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline disabled:opacity-70"
        >
          <RotateCcw className="size-3" />
          Resend code
        </button>

        {DEMO_MODE ? (
          <button
            type="button"
            onClick={() => {
              const code = DEMO_OTP.slice(0, OTP_LENGTH).split("");
              setDigits(code);
              void submit(DEMO_OTP);
            }}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <Sparkles className="size-3" />
            Fill demo code
          </button>
        ) : null}
      </div>

      {DEMO_MODE ? (
        <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-dashed border-highlight/55 bg-highlight/12 px-3 py-1.5 text-[11.5px] text-[color-mix(in_srgb,var(--highlight)_45%,var(--foreground))]">
          <span className="size-1.5 animate-pulse rounded-full bg-highlight" />
          Demo OTP{" "}
          <b className="font-mono text-[12px] tracking-[0.08em]">{DEMO_OTP}</b>
        </div>
      ) : null}

      <Button
        type="button"
        onClick={() => submit(digits.join(""))}
        disabled={status === "verifying" || status === "success" || digits.join("").length !== OTP_LENGTH}
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
    </div>
  );
}
