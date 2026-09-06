import { describe, it, expect } from "vitest";
import { calculateScore, type EngineQuestion, type UserAnswerState } from "@/features/exam-engine";

const mockQuestions: EngineQuestion[] = [
  {
    id: "q1",
    topicId: "top-grammar",
    topicName: "Grammar and Usage",
    topicSlug: "grammar-and-usage",
    subjectId: "sub-verbal",
    subjectName: "Verbal Ability",
    subjectSlug: "verbal-ability",
    questionText: "Choose the correct sentence.",
    explanation: "Subject and verb must agree in number.",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: "c1", choiceLabel: "A", text: "The team is ready.", isCorrect: true, order: 0 },
      { id: "c2", choiceLabel: "B", text: "The team are ready.", isCorrect: false, order: 1 },
    ],
  },
  {
    id: "q2",
    topicId: "top-vocab",
    topicName: "Vocabulary",
    topicSlug: "vocabulary",
    subjectId: "sub-verbal",
    subjectName: "Verbal Ability",
    subjectSlug: "verbal-ability",
    questionText: "What does meticulous mean?",
    explanation: "Meticulous means showing great attention to detail.",
    difficulty: "hard",
    language: "en",
    choices: [
      { id: "c3", choiceLabel: "A", text: "Careless", isCorrect: false, order: 0 },
      { id: "c4", choiceLabel: "B", text: "Extremely careful", isCorrect: true, order: 1 },
    ],
  },
  {
    id: "q3",
    topicId: "top-percentages",
    topicName: "Percentages",
    topicSlug: "percentages",
    subjectId: "sub-numerical",
    subjectName: "Numerical Ability",
    subjectSlug: "numerical-ability",
    questionText: "What is 20% of 150?",
    explanation: "0.20 * 150 = 30.",
    difficulty: "easy",
    language: "en",
    choices: [
      { id: "c5", choiceLabel: "A", text: "30", isCorrect: true, order: 0 },
      { id: "c6", choiceLabel: "B", text: "25", isCorrect: false, order: 1 },
    ],
  },
  {
    id: "q4",
    topicId: "top-ratios",
    topicName: "Ratios and Proportions",
    topicSlug: "ratios-and-proportions",
    subjectId: "sub-numerical",
    subjectName: "Numerical Ability",
    subjectSlug: "numerical-ability",
    questionText: "If 2:3 = x:6, what is x?",
    explanation: "Cross multiply: 3x = 12, so x = 4.",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: "c7", choiceLabel: "A", text: "4", isCorrect: true, order: 0 },
      { id: "c8", choiceLabel: "B", text: "5", isCorrect: false, order: 1 },
    ],
  },
];

describe("Generic Exam Engine — Scoring", () => {
  it("calculates 100% score when all answers are correct", () => {
    const answers: UserAnswerState[] = [
      { questionId: "q1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 15 },
      { questionId: "q2", selectedChoiceId: "c4", isFlagged: false, timeSpentSeconds: 20 },
      { questionId: "q3", selectedChoiceId: "c5", isFlagged: false, timeSpentSeconds: 10 },
      { questionId: "q4", selectedChoiceId: "c7", isFlagged: false, timeSpentSeconds: 25 },
    ];

    const result = calculateScore(mockQuestions, answers, 80);

    expect(result.totalQuestions).toBe(4);
    expect(result.answeredCount).toBe(4);
    expect(result.unansweredCount).toBe(0);
    expect(result.correctCount).toBe(4);
    expect(result.incorrectCount).toBe(0);
    expect(result.percentageScore).toBe(100.0);
    expect(result.isPassed).toBe(true);
    expect(result.strengths.length).toBe(2);
    expect(result.weakAreas.length).toBe(0);
  });

  it("calculates 0% score when all answers are wrong or unanswered", () => {
    const answers: UserAnswerState[] = [
      { questionId: "q1", selectedChoiceId: "c2", isFlagged: false, timeSpentSeconds: 10 },
      // q2, q3, q4 unanswered
    ];

    const result = calculateScore(mockQuestions, answers, 80);

    expect(result.totalQuestions).toBe(4);
    expect(result.answeredCount).toBe(1);
    expect(result.unansweredCount).toBe(3);
    expect(result.correctCount).toBe(0);
    expect(result.percentageScore).toBe(0.0);
    expect(result.isPassed).toBe(false);
  });

  it("evaluates passing threshold boundary accurately", () => {
    // 3 out of 4 is 75% -> Below 80% passing standard
    const answers: UserAnswerState[] = [
      { questionId: "q1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 10 },
      { questionId: "q2", selectedChoiceId: "c4", isFlagged: false, timeSpentSeconds: 10 },
      { questionId: "q3", selectedChoiceId: "c5", isFlagged: false, timeSpentSeconds: 10 },
      { questionId: "q4", selectedChoiceId: "c8", isFlagged: false, timeSpentSeconds: 10 }, // wrong
    ];

    const result80 = calculateScore(mockQuestions, answers, 80);
    expect(result80.percentageScore).toBe(75.0);
    expect(result80.isPassed).toBe(false);

    // With a 70% threshold, it passes
    const result70 = calculateScore(mockQuestions, answers, 70);
    expect(result70.isPassed).toBe(true);
  });

  it("generates correct per-subject and per-topic breakdowns", () => {
    const answers: UserAnswerState[] = [
      { questionId: "q1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 10 }, // Verbal: correct (1/2 = 50%)
      { questionId: "q2", selectedChoiceId: "c3", isFlagged: false, timeSpentSeconds: 10 }, // Verbal: wrong
      { questionId: "q3", selectedChoiceId: "c5", isFlagged: false, timeSpentSeconds: 10 }, // Numerical: correct (2/2 = 100%)
      { questionId: "q4", selectedChoiceId: "c7", isFlagged: false, timeSpentSeconds: 10 }, // Numerical: correct
    ];

    const result = calculateScore(mockQuestions, answers, 80);

    const verbal = result.subjectBreakdown.find((s) => s.subjectId === "sub-verbal");
    const numerical = result.subjectBreakdown.find((s) => s.subjectId === "sub-numerical");

    expect(verbal?.total).toBe(2);
    expect(verbal?.correct).toBe(1);
    expect(verbal?.percentage).toBe(50.0);

    expect(numerical?.total).toBe(2);
    expect(numerical?.correct).toBe(2);
    expect(numerical?.percentage).toBe(100.0);

    expect(result.weakAreas).toContain("Verbal Ability (50%)");
    expect(result.strengths).toContain("Numerical Ability (100%)");
    expect(result.recommendedTopics.length).toBeGreaterThan(0);
    expect(result.recommendedTopics[0].topicName).toBe("Vocabulary");
  });
});
