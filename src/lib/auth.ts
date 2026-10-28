export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 300;
export const RESEND_SECONDS = 30;
export const DEMO_OTP = "123456";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function requestOtp(_email: string): Promise<void> {
  await wait(600);
}

export type VerifyResult = { ok: true } | { ok: false; message: string };

export async function verifyOtp(
  _email: string,
  code: string,
  // _slug: string,
   _slug: string | null,
): Promise<VerifyResult> {
  await wait(700);
  return code === DEMO_OTP
    ? { ok: true }
    : { ok: false, message: "That code isn't right. Try again." };
}