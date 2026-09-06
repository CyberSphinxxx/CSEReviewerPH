import { describe, it, expect } from "vitest";
import { initializeTimer, tickTimer, formatTimeRemaining } from "@/features/exam-engine";

describe("Generic Exam Engine — Timer", () => {
  it("initializes timer with continuous total and remaining seconds", () => {
    const timer = initializeTimer(190); // 3h 10m (190 minutes)
    expect(timer.totalSeconds).toBe(11400);
    expect(timer.remainingSeconds).toBe(11400);
    expect(timer.isExpired).toBe(false);
    expect(timer.isWarning).toBe(false);
  });

  it("decrements remaining time on tick", () => {
    const timer = initializeTimer(10); // 10 minutes = 600s
    const ticked = tickTimer(timer, 5);
    expect(ticked.remainingSeconds).toBe(595);
    expect(ticked.isExpired).toBe(false);
  });

  it("triggers warning state when 5 minutes or less remain", () => {
    const timer = initializeTimer(10); // 600s
    // Tick 350 seconds -> 250s remaining (<= 300s)
    const warningTimer = tickTimer(timer, 350);
    expect(warningTimer.remainingSeconds).toBe(250);
    expect(warningTimer.isWarning).toBe(true);
    expect(warningTimer.isExpired).toBe(false);
  });

  it("triggers isExpired when remaining seconds hit zero", () => {
    const timer = initializeTimer(1); // 60s
    const expired = tickTimer(timer, 60);
    expect(expired.remainingSeconds).toBe(0);
    expect(expired.isExpired).toBe(true);

    // Further ticks keep it at 0
    const further = tickTimer(expired, 10);
    expect(further.remainingSeconds).toBe(0);
  });

  it("formats time remaining correctly in hh:mm:ss and mm:ss", () => {
    expect(formatTimeRemaining(11400)).toBe("3:10:00"); // 3 hours 10 mins
    expect(formatTimeRemaining(3665)).toBe("1:01:05");
    expect(formatTimeRemaining(599)).toBe("09:59");
    expect(formatTimeRemaining(65)).toBe("01:05");
    expect(formatTimeRemaining(9)).toBe("00:09");
    expect(formatTimeRemaining(0)).toBe("00:00");
  });
});
