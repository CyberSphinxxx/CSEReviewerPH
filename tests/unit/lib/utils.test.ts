import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn("base-class", isTrue && "active", isFalse && "inactive");
    expect(result).toBe("base-class active");
  });
});
