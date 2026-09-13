import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { getBaseUrl } from "@/lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  baseURL: getBaseUrl(),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "fallback-secret-for-development-and-testing-at-least-32-chars-long",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword(data) {
      console.log(`[Auth] Password reset link for ${data.user.email}: ${data.url}`);
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
