import { api } from "@/lib/axios";

export type Session = {
  email: string;
  name: string;
  role: string;
  tenant: string;
  issuedAt: number;
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
export const DEMO_OTP = process.env.NEXT_PUBLIC_DEMO_OTP?.trim() || "123456";

export const OTP_TTL_SECONDS = 30;
export const RESEND_SECONDS = 30;
export const OTP_LENGTH = 6;

const STORAGE_KEY = "baudhika.session";
export const AUTH_CHANGE_EVENT = "baudhika:auth";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function nameFromEmail(email: string): string {
  const raw = email.split("@")[0] ?? "";
  const cleaned = raw
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return cleaned || "Campus Admin";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    return parsed && typeof parsed.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export async function requestOtp(email: string): Promise<void> {
  if (!DEMO_MODE) {
    await api.post("/auth/request-otp", { identifier: email, channel: "email" });
    return;
  }
  await wait(650);
}

export type VerifyFailure = {
  ok: false;
  code: "INVALID_CODE" | "EXPIRED" | "TOO_MANY_ATTEMPTS";
  message: string;
};

export type VerifySuccess = { ok: true; session: Session };

export async function verifyOtp(
  email: string,
  code: string,
  tenant: string,
): Promise<VerifySuccess | VerifyFailure> {
  if (DEMO_MODE) {
    await wait(850);
    if (code !== DEMO_OTP) {
      return {
        ok: false,
        code: "INVALID_CODE",
        message: "That code doesn't match. Check your inbox and try again.",
      };
    }
  } else {
    try {
      await api.post("/auth/verify-otp", { identifier: email, code });
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 429) {
        return {
          ok: false,
          code: "TOO_MANY_ATTEMPTS",
          message: "Too many attempts. Request a fresh code to continue.",
        };
      }
      if (status === 410) {
        return {
          ok: false,
          code: "EXPIRED",
          message: "That code has expired. Request a new one.",
        };
      }
      return {
        ok: false,
        code: "INVALID_CODE",
        message: "That code doesn't match. Check your inbox and try again.",
      };
    }
  }

  const session: Session = {
    email,
    name: nameFromEmail(email),
    role: "Administrator",
    tenant,
    issuedAt: Date.now(),
  };

  writeSession(session);
  return { ok: true, session };
}
