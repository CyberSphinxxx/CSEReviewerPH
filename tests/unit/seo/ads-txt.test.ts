import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { formatPublisherId, generateAdsTxtContent } from "@/lib/ads";
import { GET } from "@/app/ads.txt/route";

describe("ads.txt/route.ts — Authorized Digital Sellers Handler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("formatPublisherId", () => {
    it("formats publisher ID correctly from ca-pub- prefix", () => {
      expect(formatPublisherId("ca-pub-1234567890123456")).toBe(
        "pub-1234567890123456"
      );
    });

    it("preserves pub- prefix if already present", () => {
      expect(formatPublisherId("pub-9876543210987654")).toBe(
        "pub-9876543210987654"
      );
    });

    it("adds pub- prefix if raw numeric ID provided", () => {
      expect(formatPublisherId("1112223334445556")).toBe("pub-1112223334445556");
    });

    it("falls back to default placeholder if empty or null", () => {
      expect(formatPublisherId(null)).toBe("pub-0000000000000000");
      expect(formatPublisherId("")).toBe("pub-0000000000000000");
    });
  });

  describe("generateAdsTxtContent", () => {
    it("generates valid Google AdSense authorized seller record", () => {
      const output = generateAdsTxtContent("ca-pub-9998887776665554");

      expect(output).toContain(
        "google.com, pub-9998887776665554, DIRECT, f08c47fec0942fa0"
      );
    });

    it("includes instructions when default placeholder is used", () => {
      const output = generateAdsTxtContent();

      expect(output).toContain("pub-0000000000000000");
      expect(output).toContain("NEXT_PUBLIC_ADSENSE_CLIENT_ID");
    });
  });

  describe("GET Route Handler", () => {
    it("returns 200 with text/plain content-type", async () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-5555444433332222";

      const response = await GET();
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/plain");

      const body = await response.text();
      expect(body).toContain(
        "google.com, pub-5555444433332222, DIRECT, f08c47fec0942fa0"
      );
    });
  });
});
