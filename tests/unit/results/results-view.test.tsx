import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsView, type AttemptData } from "@/features/results/ResultsView";
import { SEED_QUESTIONS } from "@/db/seed-data";
import { calculateScore } from "@/features/exam-engine";

describe("ResultsView Component — Addendum §50 Framing", () => {
  const sampleQuestions = SEED_QUESTIONS.slice(0, 5);
  const sampleAnswers = sampleQuestions.map((q, idx) => ({
    questionId: q.id,
    selectedChoiceId: idx < 4 ? q.choices.find((c) => c.isCorrect)?.id || null : "wrong-choice",
    isFlagged: false,
    timeSpentSeconds: 20,
  }));

  const scoreResult = calculateScore(sampleQuestions, sampleAnswers, 80, 100);

  const mockAttemptData: AttemptData = {
    id: "attempt-test-123",
    title: "Career Service Examination — Quick Diagnostic Test",
    mode: "quick",
    questions: sampleQuestions,
    answers: sampleAnswers,
    scoreResult,
    completedAt: new Date().toISOString(),
  };

  it("frames the score explicitly as an estimate based on percentage correct", () => {
    render(<ResultsView attemptData={mockAttemptData} />);

    // Check "Estimated Score" label is present
    expect(screen.getByText("Estimated Score")).toBeInTheDocument();

    // Check score wording
    expect(
      screen.getByText(/Your estimated score of 80% meets or exceeds the estimated 80.00% benchmark based on percentage of items correct./i)
    ).toBeInTheDocument();
  });

  it("displays official CSC rating formula notice citing proprietary formula per addendum §50", () => {
    render(<ResultsView attemptData={mockAttemptData} />);

    // Check transparency disclaimer header
    expect(screen.getByText("Score Interpretation & Official CSC Rating Notice")).toBeInTheDocument();

    // Check disclaimer content
    expect(
      screen.getByText(/The Philippine Civil Service Commission \(CSC\) utilizes a proprietary general rating formula/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/do not replicate or guarantee an official CSC Certificate of Eligibility rating/i)
    ).toBeInTheDocument();
  });

  it("displays subtest performance breakdown and detailed answer review", () => {
    render(<ResultsView attemptData={mockAttemptData} />);

    expect(screen.getByText("Subtest Performance Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Detailed Answer Review")).toBeInTheDocument();
  });
});
