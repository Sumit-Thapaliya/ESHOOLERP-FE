"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "cn";
import { CredentialsStep } from "@/components/auth/credentials-step";
import { OtpStep } from "@/components/auth/otp-step";
import { DEMO_MODE, DEMO_OTP } from "@/lib/auth";
import { useTenant } from "@/providers/tenant-provider";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

type Step = "credentials" | "otp";

function titleize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StepPills({ step }: { step: Step }) {
  const identifyDone = step === "otp";

  return (
    <div className="mb-5 flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-all duration-300",
          identifyDone
            ? "border-teal/40 bg-teal/10 text-teal"
            : "border-primary bg-primary text-primary-foreground",
        )}
      >
        <span
          className={cn(
            "grid size-[15px] place-items-center rounded-full text-[9.5px] font-bold",
            identifyDone ? "bg-teal/25" : "bg-white/25",
          )}
        >
          {identifyDone ? "✓" : "1"}
        </span>
        Identify
      </span>

      <span className="h-px min-w-1.5 flex-1 bg-border" />

      <span
        className={cn(
          "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-all duration-300",
          identifyDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card/60 text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "grid size-[15px] place-items-center rounded-full text-[9.5px] font-bold",
            identifyDone ? "bg-white/25" : "bg-muted text-muted-foreground",
          )}
        >
          2
        </span>
        Verify
      </span>
    </div>
  );
}

export default function LoginPage() {
  const { slug } = useTenant();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");

  return (
    <div className="w-full">
      <motion.div
        layout
        transition={{ duration: 0.42, ease: EASE }}
        className="grid gap-3.5"
      >
        <motion.div layout className="flex items-center justify-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[17px] font-semibold tracking-[-0.012em]">
              Baudhika <span className="font-medium text-muted-foreground">ERP</span>
            </p>
            <p className="text-[11px] text-muted-foreground">{titleize(slug)}</p>
          </div>
        </motion.div>

        <motion.div
          layout
          transition={{ duration: 0.42, ease: EASE }}
          className="relative overflow-hidden rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 shadow-[0_32px_72px_-34px_rgba(9,32,50,0.42),inset_0_1px_0_rgba(255,255,255,0.36)] backdrop-blur-2xl backdrop-saturate-150 dark:border-border dark:bg-card/75 dark:shadow-[0_34px_76px_-30px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <StepPills step={step} />

          <motion.div layout transition={{ duration: 0.42, ease: EASE }} className="relative">
            <AnimatePresence mode="wait" initial={false}>
              {step === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <CredentialsStep
                    onSent={(value) => {
                      setEmail(value);
                      setStep("otp");
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <OtpStep email={email} onBack={() => setStep("credentials")} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.p
          layout
          className="text-center text-[11.5px] text-muted-foreground"
        >
          {DEMO_MODE ? (
            <>
              Demo OTP{" "}
              <b className="font-mono tracking-[0.06em] text-foreground">{DEMO_OTP}</b> · any
              email &amp; password works
            </>
          ) : (
            "Protected by two-factor authentication"
          )}
        </motion.p>
      </motion.div>
    </div>
  );
}
