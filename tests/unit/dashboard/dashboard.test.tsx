import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardView } from "@/features/dashboard/DashboardView";

describe("DashboardView Component", () => {
  it("renders accuracy, test count, streak, subtests, and guest storage controls", () => {
    render(<DashboardView />);

    expect(screen.getByText("User Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Overall Accuracy")).toBeInTheDocument();
    expect(screen.getByText("Tests Completed")).toBeInTheDocument();
    expect(screen.getByText("Study Streak")).toBeInTheDocument();
    expect(screen.getByText("Mistake Bank")).toBeInTheDocument();
    expect(screen.getByText("Saved Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Civil Service Subtest Readiness")).toBeInTheDocument();
    expect(screen.getByText("Your Progress is Saved Locally")).toBeInTheDocument();
    expect(screen.getByText("Export Backup (JSON)")).toBeInTheDocument();
    expect(screen.getByText("Restore Backup")).toBeInTheDocument();
    expect(screen.getByText("Reset All Data")).toBeInTheDocument();
  });

  it("dynamically reflects completed attempts from LocalStorageService", async () => {
    const { LocalStorageService } = await import("@/lib/storage");
    LocalStorageService.recordCompletedAttempt({
      id: "att-dash-test",
      title: "Quick Test Pro",
      mode: "quick",
      rules: {
        mode: "quick",
        itemCount: 1,
        timeLimitMinutes: 10,
        passingScorePercentage: 80,
        allowsFlagging: true,
        hasContinuousTimer: true,
        subjectDistribution: {},
        difficultyDistribution: {},
      },
      questions: [],
      answers: [],
      scoreResult: {
        totalQuestions: 1,
        answeredCount: 1,
        unansweredCount: 0,
        correctCount: 1,
        incorrectCount: 0,
        rawScore: 1,
        percentageScore: 100,
        isPassed: true,
        passingScorePercentage: 80,
        timeSpentSeconds: 15,
        subjectBreakdown: [],
        topicBreakdown: [],
        strengths: [],
        weakAreas: [],
        recommendedTopics: [],
      },
      completedAt: new Date().toISOString(),
    });

    render(<DashboardView />);

    // Test count and streak should be rendered
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});

