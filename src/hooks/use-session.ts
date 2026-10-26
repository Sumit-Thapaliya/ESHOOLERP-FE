"use client";

import { useEffect, useState } from "react";
import { AUTH_CHANGE_EVENT, readSession, type Session } from "@/lib/auth";

export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setSession(readSession());

    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session: session ?? null, loading: session === undefined };
}
