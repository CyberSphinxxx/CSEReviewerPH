import { describe, it, expect } from "vitest";
import {
  getExamLevelInfo,
  getAllExamLevels,
  prepareExamSession,
} from "@/features/practice/practice-service";

describe("Practice Service — CSE Implementation", () => {
  it("loads all exam levels", () => {
    const levels = getAllExamLevels();
    expect(levels.length).toBe(2);
    expect(levels.map((l) => l.slug)).toEqual(["professional", "subprofessional"]);
  });

  it("loads CSE Professional level and its official subtests", () => {
    const pro = getExamLevelInfo("professional");
    expect(pro).not.toBeNull();
    expect(pro?.name).toBe("Career Service Professional");

    const subjectSlugs = pro?.subjects.map((s) => s.slug);
    expect(subjectSlugs).toContain("verbal-ability");
    expect(subjectSlugs).toContain("numerical-ability");
    expect(subjectSlugs).toContain("analytical-ability");
    expect(subjectSlugs).toContain("general-information");
    expect(subjectSlugs).not.toContain("clerical-ability");
  });

  it("loads CSE Subprofessional level and its clerical subtest", () => {
    const subpro = getExamLevelInfo("subprofessional");
    expect(subpro).not.toBeNull();
    expect(subpro?.name).toBe("Career Service Subprofessional");

    const subjectSlugs = subpro?.subjects.map((s) => s.slug);
    expect(subjectSlugs).toContain("clerical-ability");
    expect(subjectSlugs).not.toContain("analytical-ability");
  });

  it("strictly seeds Analytical Ability only under Professional and Clerical Ability only under Subprofessional", () => {
    const pro = getExamLevelInfo("professional")!;
    const subpro = getExamLevelInfo("subprofessional")!;

    const proSubjects = pro.subjects.map((s) => s.slug);
    const subproSubjects = subpro.subjects.map((s) => s.slug);

    expect(proSubjects).toContain("analytical-ability");
    expect(subproSubjects).not.toContain("analytical-ability");

    expect(subproSubjects).toContain("clerical-ability");
    expect(proSubjects).not.toContain("clerical-ability");
  });

  it("prepares Quick Test session with 10 questions and 10 minutes", () => {
    const { session, questions, rules } = prepareExamSession("professional", "quick");
    expect(session.totalQuestions).toBe(10);
    expect(questions.length).toBe(10);
    expect(rules.timeLimitMinutes).toBe(10);
    expect(session.timer.remainingSeconds).toBe(600);
  });

  it("prepares Medium Test session with 30 questions and 30 minutes", () => {
    const { session, questions, rules } = prepareExamSession("professional", "medium");
    expect(session.totalQuestions).toBe(30);
    expect(questions.length).toBe(30);
    expect(rules.timeLimitMinutes).toBe(30);
    expect(session.timer.remainingSeconds).toBe(1800);
  });

  it("prepares Full Test session with single continuous timer (190m for Pro)", () => {
    const { session, questions, rules } = prepareExamSession("professional", "full");
    expect(session.totalQuestions).toBe(170);
    expect(questions.length).toBe(170);
    expect(rules.timeLimitMinutes).toBe(190);
    expect(rules.hasContinuousTimer).toBe(true);
    expect(session.timer.remainingSeconds).toBe(190 * 60);
  });

  it("prepares Topic Practice session with only the topic's questions without duplicating to 170", () => {
    const { session, questions, rules } = prepareExamSession("professional", "practice", {
      topicId: "top-pro-analogy",
      questionLimit: 10,
    });

    expect(session.totalQuestions).toBeLessThanOrEqual(10);
    expect(questions.length).toBe(session.totalQuestions);
    expect(session.totalQuestions).not.toBe(170);
    // All questions belong strictly to the requested topic
    for (const q of questions) {
      expect(q.topicId).toBe("top-pro-analogy");
    }
    expect(rules.timeLimitMinutes).toBe(15);
  });

  it("ensures all seed questions do not leak [SEED-PLACEHOLDER] in questionText", async () => {
    const { SEED_QUESTIONS } = await import("@/db/seed-data");
    expect(SEED_QUESTIONS.length).toBeGreaterThan(0);
    for (const q of SEED_QUESTIONS) {
      expect(q.questionText).not.toContain("[SEED-PLACEHOLDER]");
      expect(q.questionText).not.toContain("[SEED DATA]");
    }
  });
});
