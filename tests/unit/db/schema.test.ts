import { describe, it, expect } from "vitest";
import {
  exams,
  examLevels,
  examRules,
  subjects,
  topics,
  questions,
  choices,
  testAttempts,
  userAnswers,
  bookmarks,
  userProgress,
} from "@/db/schema";

describe("Database Schema Constraints & Types", () => {
  it("verifies exam and exam level table configurations", () => {
    expect(exams.id).toBeDefined();
    expect(exams.slug).toBeDefined();
    expect(examLevels.examId).toBeDefined();
    expect(examLevels.isDefault.default).toBe(false);
  });

  it("verifies question metadata requirements", () => {
    // Required fields
    expect(questions.topicId).toBeDefined();
    expect(questions.questionText).toBeDefined();
    expect(questions.explanation).toBeDefined();

    // Default status is 'draft' per content lifecycle
    expect(questions.status.default).toBe("draft");

    // Default language is 'en'
    expect(questions.language.default).toBe("en");

    // Default difficulty is 'medium'
    expect(questions.difficulty.default).toBe("medium");

    // Seed data flag defaults to false
    expect(questions.isSeedData.default).toBe(false);
  });

  it("verifies choice entity structure", () => {
    expect(choices.questionId).toBeDefined();
    expect(choices.choiceLabel).toBeDefined();
    expect(choices.text).toBeDefined();
    expect(choices.isCorrect.default).toBe(false);
  });

  it("verifies exam rules schema contains single continuous timer configuration", () => {
    expect(examRules.timeLimitMinutes).toBeDefined();
    expect(examRules.itemCount).toBeDefined();
    expect(examRules.hasContinuousTimer.default).toBe(true);
    expect(examRules.allowsFlagging.default).toBe(true);
    expect(examRules.passingScorePercentage.default).toBe("80.00");
  });

  it("verifies test attempts and answers structure", () => {
    expect(testAttempts.examLevelId).toBeDefined();
    expect(testAttempts.mode).toBeDefined();
    expect(testAttempts.status.default).toBe("in_progress");
    expect(testAttempts.score.default).toBe(0);

    expect(userAnswers.testAttemptId).toBeDefined();
    expect(userAnswers.questionId).toBeDefined();
    expect(userAnswers.isFlagged.default).toBe(false);
    expect(userAnswers.isCorrect.default).toBe(false);

    // Subject and Topic
    expect(subjects.examLevelId).toBeDefined();
    expect(topics.subjectId).toBeDefined();

    // User Progress & Bookmarks
    expect(bookmarks.questionId).toBeDefined();
    expect(userProgress.topicId).toBeDefined();
  });
});
