import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/questions/report/route";
import { NextRequest } from "next/server";

describe("Question Report API Endpoint (/api/questions/report)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if questionId is missing or empty", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        reason: "factual_error",
        comments: "Wrong answer key.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toMatch(/questionId/);
  });

  it("returns 400 if reason is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "unsupported_reason_code",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toMatch(/reason/);
  });

  it("returns 201 with reportId on valid payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "factual_error",
        comments: "According to CSC MC No. 19, this item has changed.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reportId).toBeDefined();
    expect(data.message).toBeDefined();
  });
});
