import { describe, it, expect } from "vitest";
import {
  createExamSession,
  selectChoice,
  toggleFlag,
  navigateNext,
  navigatePrev,
  jumpToQuestion,
  getExamSessionSummary,
  stepTimer,
  type EngineQuestion,
} from "@/features/exam-engine";

const mockQuestions: EngineQuestion[] = [
  {
    id: "q1",
    topicId: "t1",
    topicName: "Topic 1",
    topicSlug: "topic-1",
    subjectId: "s1",
    subjectName: "Subject 1",
    subjectSlug: "subject-1",
    questionText: "Question 1?",
    explanation: "Exp 1",
    difficulty: "easy",
    language: "en",
    choices: [
      { id: "c1", choiceLabel: "A", text: "Ans A", isCorrect: true, order: 0 },
      { id: "c2", choiceLabel: "B", text: "Ans B", isCorrect: false, order: 1 },
    ],
  },
  {
    id: "q2",
    topicId: "t2",
    topicName: "Topic 2",
    topicSlug: "topic-2",
    subjectId: "s1",
    subjectName: "Subject 1",
    subjectSlug: "subject-1",
    questionText: "Question 2?",
    explanation: "Exp 2",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: "c3", choiceLabel: "A", text: "Ans A", isCorrect: false, order: 0 },
      { id: "c4", choiceLabel: "B", text: "Ans B", isCorrect: true, order: 1 },
    ],
  },
];

describe("Generic Exam Engine — State Machine", () => {
  it("initializes session correctly", () => {
    const session = createExamSession(mockQuestions, 10, true);
    expect(session.currentIndex).toBe(0);
    expect(session.totalQuestions).toBe(2);
    expect(session.isReviewing).toBe(false);
    expect(session.isSubmitted).toBe(false);
    expect(session.timer.remainingSeconds).toBe(600);

    const summary = getExamSessionSummary(session);
    expect(summary.total).toBe(2);
    expect(summary.answered).toBe(0);
    expect(summary.unanswered).toBe(2);
    expect(summary.flagged).toBe(0);
  });

  it("handles answer selection and summary update", () => {
    let session = createExamSession(mockQuestions, 10);
    session = selectChoice(session, "q1", "c1");

    expect(session.answers.get("q1")?.selectedChoiceId).toBe("c1");

    const summary = getExamSessionSummary(session);
    expect(summary.answered).toBe(1);
    expect(summary.unanswered).toBe(1);
  });

  it("toggles flagging on questions", () => {
    let session = createExamSession(mockQuestions, 10);
    expect(session.answers.get("q1")?.isFlagged).toBe(false);

    session = toggleFlag(session, "q1");
    expect(session.answers.get("q1")?.isFlagged).toBe(true);
    expect(getExamSessionSummary(session).flagged).toBe(1);

    session = toggleFlag(session, "q1");
    expect(session.answers.get("q1")?.isFlagged).toBe(false);
    expect(getExamSessionSummary(session).flagged).toBe(0);
  });

  it("navigates next, prev, and jumps to question", () => {
    let session = createExamSession(mockQuestions, 10);
    expect(session.currentIndex).toBe(0);

    session = navigateNext(session);
    expect(session.currentIndex).toBe(1);

    // cannot go past end
    session = navigateNext(session);
    expect(session.currentIndex).toBe(1);

    session = navigatePrev(session);
    expect(session.currentIndex).toBe(0);

    session = jumpToQuestion(session, 1);
    expect(session.currentIndex).toBe(1);
  });

  it("auto-submits exam when timer expires", () => {
    let session = createExamSession(mockQuestions, 1); // 60s
    expect(session.isSubmitted).toBe(false);

    // Step 59 seconds
    session = stepTimer(session, 59);
    expect(session.isSubmitted).toBe(false);
    expect(session.timer.remainingSeconds).toBe(1);

    // Step 1 more second -> expiry -> auto-submit!
    session = stepTimer(session, 1);
    expect(session.timer.isExpired).toBe(true);
    expect(session.isSubmitted).toBe(true);
  });
});
