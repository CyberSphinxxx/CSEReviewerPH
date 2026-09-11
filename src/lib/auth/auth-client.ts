import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : getBaseUrl(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
