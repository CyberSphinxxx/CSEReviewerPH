import { describe, it, expect } from "vitest";
import { getNextBestStepRecommendation } from "@/features/dashboard/recommendation-engine";
import type { AttemptSummary, StoredMistakeItem } from "@/lib/storage";

describe("Dashboard Next Best Step Recommendation Engine", () => {
  it("recommends a 10-question diagnostic for brand new learners with zero attempts", () => {
    const rec = getNextBestStepRecommendation([], [], []);
    expect(rec.type).toBe("diagnostic");
    expect(rec.actionHref).toBe("/exams/professional/quick");
    expect(rec.title).toContain("Diagnostic");
    expect(rec.urgency).toBe("high");
  });

  it("prioritizes due Leitner spaced repetition mistakes over weak subtest drills", () => {
    const mockAttempt: AttemptSummary = {
      id: "att-1",
      title: "Quick Test Pro",
      mode: "quick",
      date: new Date().toISOString(),
      rawScore: 5,
      totalQuestions: 10,
      percentage: 50,
      passed: false,
    };

    const mockDueMistake: StoredMistakeItem = {
      id: "q-1",
      attemptId: "att-1",
      question: {
        id: "q-1",
        subjectId: "sub-1",
        subjectName: "Numerical Ability",
        subjectSlug: "numerical-ability",
        topicId: "top-1",
        topicName: "Number Series",
        topicSlug: "number-series",
        questionText: "What comes next: 2, 4, 8, ...",
        choices: [],
        explanation: "Powers of 2",
        difficulty: "medium",
        language: "en",
      },
      selectedChoiceId: "c-1",
      correctChoiceId: "c-2",
      addedAt: new Date().toISOString(),
      reviewCount: 1,
      box: 1,
      nextReviewDue: new Date(Date.now() - 10000).toISOString(), // overdue
    };

    const rec = getNextBestStepRecommendation([mockAttempt], [mockDueMistake], [mockDueMistake]);
    expect(rec.type).toBe("srs_review");
    expect(rec.actionHref).toContain("/dashboard/mistakes");
    expect(rec.urgency).toBe("urgent");
    expect(rec.title).toContain("1 Due Missed Question");
  });

  it("recommends targeted subtest drill when a subtest falls below 80% passing benchmark", () => {
    const mockAttempt: AttemptSummary = {
      id: "att-1",
      title: "Quick Test Pro",
      mode: "quick",
      date: new Date().toISOString(),
      rawScore: 6,
      totalQuestions: 10,
      percentage: 60,
      passed: false,
    };

    // Subtest accuracy map provided
    const subtestAccuracies = [
      { name: "Verbal Ability", accuracy: 90 },
      { name: "Numerical Ability", accuracy: 55 },
      { name: "General Information", accuracy: 85 },
    ];

    const rec = getNextBestStepRecommendation([mockAttempt], [], [], subtestAccuracies);
    expect(rec.type).toBe("weak_subtest");
    expect(rec.title).toContain("Numerical Ability");
    expect(rec.title).toContain("55%");
    expect(rec.actionHref).toBe("/practice");
  });

  it("recommends a Full Mock Exam when examinee has high accuracy across subtests", () => {
    const attempts: AttemptSummary[] = [
      {
        id: "att-1",
        title: "Quick Test Pro",
        mode: "quick",
        date: new Date().toISOString(),
        rawScore: 9,
        totalQuestions: 10,
        percentage: 90,
        passed: true,
      },
      {
        id: "att-2",
        title: "Medium Test Pro",
        mode: "medium",
        date: new Date().toISOString(),
        rawScore: 26,
        totalQuestions: 30,
        percentage: 86.7,
        passed: true,
      },
      {
        id: "att-3",
        title: "Quick Test Pro",
        mode: "quick",
        date: new Date().toISOString(),
        rawScore: 10,
        totalQuestions: 10,
        percentage: 100,
        passed: true,
      },
    ];

    const subtestAccuracies = [
      { name: "Verbal Ability", accuracy: 92 },
      { name: "Numerical Ability", accuracy: 88 },
      { name: "Analytical Ability", accuracy: 85 },
    ];

    const rec = getNextBestStepRecommendation(attempts, [], [], subtestAccuracies);
    expect(rec.type).toBe("full_mock");
    expect(rec.actionHref).toBe("/exams/professional/full");
    expect(rec.title).toContain("Full 170-Item Mock Exam");
  });
});
