import { describe, it, expect } from "vitest";
import {
  createExamSession,
  stepTimer,
  type EngineQuestion,
  type ExamRuleConfig,
} from "@/features/exam-engine";

function createMockQuestion(id: string): EngineQuestion {
  return {
    id,
    topicId: "top-1",
    topicName: "Math",
    topicSlug: "math",
    subjectId: "sub-1",
    subjectName: "Numerical",
    subjectSlug: "numerical",
    questionText: `Question ${id}?`,
    explanation: "Sample explanation",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: `${id}-c1`, choiceLabel: "A", text: "Choice A", isCorrect: true, order: 0 },
      { id: `${id}-c2`, choiceLabel: "B", text: "Choice B", isCorrect: false, order: 1 },
    ],
  };
}

describe("Exam Engine — Timer Wall-Clock Delta & Background Throttling", () => {
  const mockQuestions = [createMockQuestion("q1"), createMockQuestion("q2")];
  const rules: ExamRuleConfig = {
    mode: "quick",
    itemCount: 2,
    timeLimitMinutes: 10, // 600 seconds
    passingScorePercentage: 80,
    allowsFlagging: true,
    hasContinuousTimer: true,
  };

  it("accurately decrements remaining time across wall-clock delta jumps", () => {
    let session = createExamSession(mockQuestions, rules.timeLimitMinutes, rules.allowsFlagging);
    expect(session.timer.remainingSeconds).toBe(600);
    expect(session.timer.isExpired).toBe(false);

    // Simulate tab backgrounding for 45 seconds
    session = stepTimer(session, 45);
    expect(session.timer.remainingSeconds).toBe(555);
    expect(session.answers.get("q1")?.timeSpentSeconds).toBe(45);
    expect(session.timer.isExpired).toBe(false);

    // Simulate another jump of 300 seconds (entering warning zone)
    session = stepTimer(session, 300);
    expect(session.timer.remainingSeconds).toBe(255);
    expect(session.answers.get("q1")?.timeSpentSeconds).toBe(345);
    expect(session.timer.isWarning).toBe(true);
    expect(session.timer.isExpired).toBe(false);
  });

  it("handles delta jump exceeding remaining time without negative values and triggers auto-submit", () => {
    let session = createExamSession(mockQuestions, rules.timeLimitMinutes, rules.allowsFlagging);
    expect(session.timer.remainingSeconds).toBe(600);

    // Jump 700 seconds (greater than total 600)
    session = stepTimer(session, 700);
    expect(session.timer.remainingSeconds).toBe(0);
    expect(session.timer.isExpired).toBe(true);
    expect(session.isSubmitted).toBe(true);
  });
});
