// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getBaseUrl, isVercel, getEnvironment } from "@/lib/env";

describe("Environment & URL Resolution Helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.BETTER_AUTH_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns fallback localhost:3000 when no environment variables are set", () => {
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("prioritizes NEXT_PUBLIC_APP_URL when present", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://csereviewph.com/";
    process.env.VERCEL_URL = "preview-abc.vercel.app";
    expect(getBaseUrl()).toBe("https://csereviewph.com");
  });

  it("resolves BETTER_AUTH_URL if NEXT_PUBLIC_APP_URL is not set", () => {
    process.env.BETTER_AUTH_URL = "https://auth.csereviewph.com/";
    expect(getBaseUrl()).toBe("https://auth.csereviewph.com");
  });

  it("resolves VERCEL_PROJECT_PRODUCTION_URL when present", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "cse-reviewer.vercel.app/";
    expect(getBaseUrl()).toBe("https://cse-reviewer.vercel.app");
  });

  it("resolves VERCEL_URL preview deployment properly with https prefix", () => {
    process.env.VERCEL_URL = "cse-reviewer-ph-git-feature-preview.vercel.app";
    expect(getBaseUrl()).toBe("https://cse-reviewer-ph-git-feature-preview.vercel.app");
  });

  it("correctly identifies Vercel platform environment", () => {
    expect(isVercel()).toBe(false);
    process.env.VERCEL = "1";
    expect(isVercel()).toBe(true);
  });

  it("returns appropriate environment name", () => {
    process.env.VERCEL_ENV = "preview";
    expect(getEnvironment()).toBe("preview");
  });
});
