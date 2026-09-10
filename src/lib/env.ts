/**
 * Helper utilities for resolving deployment environment variables
 * and URLs dynamically across Vercel Preview, Production, and local environments.
 */

export function getBaseUrl(): string {
  // 1. Browser context: always use the current window location
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Explicit public app URL override
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }

  // 3. Better Auth configured URL
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/+$/, "");
  }

  // 4. Vercel production custom domain / canonical alias
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "")}`;
  }

  // 5. Vercel deployment URL (automatic for preview and branch deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  // 6. Production fallback if no domain env is provided
  if (process.env.NODE_ENV === "production") {
    return "https://csereviewph.com";
  }

  // 7. Local development fallback
  return "http://localhost:3000";
}

export function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

export function getEnvironment(): string {
  return process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
}
