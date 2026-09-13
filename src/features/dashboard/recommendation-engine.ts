import type { AttemptSummary, StoredMistakeItem } from "@/lib/storage";

export interface SubtestAccuracySummary {
  name: string;
  accuracy: number;
}

export interface NextBestStepRecommendation {
  type: "diagnostic" | "srs_review" | "weak_subtest" | "full_mock" | "maintain_streak";
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  tag: string;
  urgency: "urgent" | "high" | "medium" | "milestone" | "normal";
  badgeCount?: number;
  subtext?: string;
}

/**
 * Computes the examinee's single most impactful next action based on their
 * real learning history, Leitner SRS due items, and subtest practice accuracy.
 */
export function getNextBestStepRecommendation(
  attempts: AttemptSummary[],
  dueMistakes: StoredMistakeItem[],
  allMistakes: StoredMistakeItem[],
  subtestAccuracies?: SubtestAccuracySummary[]
): NextBestStepRecommendation {
  // 1. First-time examinee: Zero attempts completed
  if (attempts.length === 0) {
    return {
      type: "diagnostic",
      title: "Take a 10-Question Diagnostic Benchmark",
      description:
        "Establish your baseline practice accuracy across Civil Service subtests against your 80% study target.",
      actionLabel: "Start Diagnostic Drill (10 min)",
      actionHref: "/exams/professional/quick",
      tag: "Immediate Priority",
      urgency: "high",
      subtext: "10 mixed questions • Instant concept explanations",
    };
  }

  // 2. Active Spaced Repetition (SRS): Due items in Mistake Bank
  if (dueMistakes.length > 0) {
    const count = dueMistakes.length;
    const plural = count > 1;
    return {
      type: "srs_review",
      title: `${count} question${plural ? "s" : ""} ready to review`,
      description: "Revisit these questions from your earlier practice to reinforce concept retention.",
      actionLabel: `Review ${count} question${plural ? "s" : ""}`,
      actionHref: "/dashboard/mistakes?filter=due",
      tag: "Spaced Repetition",
      urgency: "urgent",
      badgeCount: count,
      subtext: "Leitner spaced review • Scheduled for today",
    };
  }

  // 3. Weak Subtest Targeting: Any subtest performing below 80% study target
  if (subtestAccuracies && subtestAccuracies.length > 0) {
    const subtestsBelowBenchmark = subtestAccuracies
      .filter((s) => s.accuracy < 80)
      .sort((a, b) => a.accuracy - b.accuracy);

    if (subtestsBelowBenchmark.length > 0) {
      const weakest = subtestsBelowBenchmark[0];
      return {
        type: "weak_subtest",
        title: `Strengthen ${weakest.name} (${weakest.accuracy}%)`,
        description: `Your practice accuracy in ${weakest.name} is currently ${weakest.accuracy}%, below your 80% study target. Focused topic drills will help close this gap.`,
        actionLabel: `Practice ${weakest.name}`,
        actionHref: "/practice",
        tag: "Study Target Gap",
        urgency: "medium",
        subtext: "Goal: Reach 80%+ practice accuracy",
      };
    }
  }

  // 4. Milestone Simulation: Examinee has passed multiple tests with high overall accuracy
  const totalPassed = attempts.filter((a) => a.passed).length;
  const recentAccuracy =
    attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length;

  if (attempts.length >= 3 && recentAccuracy >= 80 && totalPassed >= 2) {
    return {
      type: "full_mock",
      title: "Take a Full 170-Item Mock Exam",
      description:
        "Validate your stamina and pacing under official 3h 10m continuous timing.",
      actionLabel: "Launch Full Mock Exam",
      actionHref: "/exams/professional/full",
      tag: "Exam Simulation",
      urgency: "milestone",
      subtext: "170 items • 3h 10m continuous timer • Real exam pacing",
    };
  }

  // 5. Daily Consistency / Maintenance
  return {
    type: "maintain_streak",
    title: "Daily 10-Question Quick Drill",
    description:
      "Sharpen your question pacing and keep your recall active with a short mixed-subject session.",
    actionLabel: "Start Quick Drill (10 min)",
    actionHref: "/exams/professional/quick",
    tag: "Daily Pacing",
    urgency: "normal",
    subtext: "10 mixed items • Maintain daily study habit",
  };
}
