import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExamRunner } from "@/features/practice/ExamRunner";
import type { EngineQuestion, ExamRuleConfig } from "@/features/exam-engine";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockQuestions: EngineQuestion[] = [
  {
    id: "q1",
    topicId: "top-1",
    topicName: "Grammar",
    topicSlug: "grammar",
    subjectId: "sub-1",
    subjectName: "Verbal Ability",
    subjectSlug: "verbal-ability",
    questionText: "Sample Question 1 text",
    explanation: "Educational explanation for question 1",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: "c1", choiceLabel: "A", text: "Alpha Choice", isCorrect: true, order: 0 },
      { id: "c2", choiceLabel: "B", text: "Beta Choice", isCorrect: false, order: 1 },
    ],
  },
  {
    id: "q2",
    topicId: "top-2",
    topicName: "Percentages",
    topicSlug: "percentages",
    subjectId: "sub-2",
    subjectName: "Numerical Ability",
    subjectSlug: "numerical-ability",
    questionText: "Sample Question 2 text",
    explanation: "Educational explanation for question 2",
    difficulty: "easy",
    language: "en",
    choices: [
      { id: "c3", choiceLabel: "A", text: "Gamma Choice", isCorrect: false, order: 0 },
      { id: "c4", choiceLabel: "B", text: "Delta Choice", isCorrect: true, order: 1 },
    ],
  },
];

const mockRules: ExamRuleConfig = {
  mode: "quick",
  itemCount: 2,
  timeLimitMinutes: 10,
  passingScorePercentage: 80,
  allowsFlagging: true,
  hasContinuousTimer: true,
};

describe("ExamRunner Component", () => {
  it("renders exam header, timer, and current question", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText("Diagnostic Quick Test")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Sample Question 1 text")).toBeInTheDocument();
    expect(screen.getByText("Alpha Choice")).toBeInTheDocument();
    expect(screen.getByText("Beta Choice")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("selects choices and updates answer count", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText("0 of 2 answered")).toBeInTheDocument();

    const choiceBtn = screen.getByText("Alpha Choice");
    fireEvent.click(choiceBtn);

    expect(screen.getByText("1 of 2 answered")).toBeInTheDocument();
  });

  it("toggles flag state on current question", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const flagBtn = screen.getByRole("button", { name: /flag/i });
    expect(flagBtn).toHaveTextContent("Flag");

    fireEvent.click(flagBtn);
    expect(flagBtn).toHaveTextContent("Flagged");

    fireEvent.click(flagBtn);
    expect(flagBtn).toHaveTextContent("Flag");
  });

  it("navigates between questions with Next and Previous buttons", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Sample Question 2 text")).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });

  it("opens review modal before submission", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Review Before Submission")).toBeInTheDocument();
    expect(screen.getByText("Continue Exam")).toBeInTheDocument();
    expect(screen.getByText("Submit & View Results")).toBeInTheDocument();
  });

  it("detects existing active draft, shows resume banner, and resumes session on click", async () => {
    const { LocalStorageService } = await import("@/lib/storage");
    LocalStorageService.saveActiveDraft({
      id: "draft-pro-quick",
      levelSlug: "professional",
      mode: "quick",
      title: "Diagnostic Quick Test",
      rules: mockRules,
      questions: mockQuestions,
      answers: {
        q1: { questionId: "q1", selectedChoiceId: "c1", isFlagged: true, timeSpentSeconds: 12 },
      },
      flaggedQuestionIds: ["q1"],
      currentQuestionIndex: 0,
      remainingSeconds: 450,
      startedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
    });

    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText(/Unfinished Session Found/i)).toBeInTheDocument();
    expect(screen.getByText(/1 answered/i)).toBeInTheDocument();

    const resumeBtn = screen.getByRole("button", { name: /Resume Session/i });
    fireEvent.click(resumeBtn);

    // Banner should dismiss and flagged status should be restored
    expect(screen.queryByText(/Unfinished Session Found/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /flag/i })).toHaveTextContent("Flagged");
  });

  it("discards existing draft when Discard & Start Fresh is clicked", async () => {
    const { LocalStorageService } = await import("@/lib/storage");
    LocalStorageService.saveActiveDraft({
      id: "draft-pro-quick",
      levelSlug: "professional",
      mode: "quick",
      title: "Diagnostic Quick Test",
      rules: mockRules,
      questions: mockQuestions,
      answers: {
        q1: { questionId: "q1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 5 },
      },
      flaggedQuestionIds: [],
      currentQuestionIndex: 0,
      remainingSeconds: 500,
      startedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
    });

    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const discardBtn = screen.getByRole("button", { name: /Discard & Start Fresh/i });
    fireEvent.click(discardBtn);

    expect(screen.queryByText(/Unfinished Session Found/i)).not.toBeInTheDocument();
    expect(LocalStorageService.getActiveDraft("professional", "quick")).toBeNull();
  });
});

