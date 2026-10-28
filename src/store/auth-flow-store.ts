import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { OTP_TTL_SECONDS, RESEND_SECONDS } from "@/lib/auth";

export type Step = "credentials" | "otp";

type AuthFlowState = {
  step: Step;
  email: string;
  expiresAt: number | null; // epoch ms
  resendAt: number | null; // epoch ms
  startOtp: (email: string) => void;
  refreshTimers: () => void;
  backToCredentials: () => void;
  clearFlow: () => void;
};

const timers = () => ({
  expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
  resendAt: Date.now() + RESEND_SECONDS * 1000,
});

const initial = {
  step: "credentials" as Step,
  email: "",
  expiresAt: null as number | null,
  resendAt: null as number | null,
};

export const useAuthFlow = create<AuthFlowState>()(
  persist(
    (set) => ({
      ...initial,
      startOtp: (email) => set({ step: "otp", email, ...timers() }),
      refreshTimers: () => set(timers()),
      backToCredentials: () =>
        set({ step: "credentials", expiresAt: null, resendAt: null }),
      clearFlow: () => set(initial),
    }),
    {
      name: "auth-flow",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true, // load after mount to avoid SSR hydration mismatch
      partialize: ({ step, email, expiresAt, resendAt }) => ({
        step,
        email,
        expiresAt,
        resendAt,
      }),
    },
  ),
);

export function useAuthFlowHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useAuthFlow.persist.onFinishHydration(() => setHydrated(true));
    void useAuthFlow.persist.rehydrate();
    return unsub;
  }, []);
  return hydrated;
}