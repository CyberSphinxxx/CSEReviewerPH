import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health Check API Route (/api/health)", () => {
  it("returns 200 OK with status and diagnostic metadata", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
    expect(body.environment).toBeDefined();
    expect(body.platform).toBeDefined();
    expect(body.database).toBeDefined();
    expect(typeof body.database.configured).toBe("boolean");
  });

  it("sets no-cache headers for accurate health checking", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
  });
});
