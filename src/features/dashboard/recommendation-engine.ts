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
 * real learning history, Leitner SRS due items, and subtest benchmark scores.
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
      title: "Take Your 10-Question Diagnostic Benchmark",
      description:
        "Establish your baseline proficiency across Civil Service subtests against the official 80% passing standard. Takes less than 10 minutes.",
      actionLabel: "Start Diagnostic Drill (10 min)",
      actionHref: "/exams/professional/quick",
      tag: "Immediate Priority",
      urgency: "high",
      subtext: "10 mixed questions • Immediate concept explanations",
    };
  }

  // 2. Active Spaced Repetition (SRS): Due items in Mistake Bank
  if (dueMistakes.length > 0) {
    const plural = dueMistakes.length > 1;
    return {
      type: "srs_review",
      title: `Review ${dueMistakes.length} Due Missed Question${plural ? "s" : ""}`,
      description: `Leitner spaced repetition interval has matured. Reviewing these items now reinforces concept retention before questions demote to Box 1.`,
      actionLabel: "Practice Due Mistakes",
      actionHref: "/dashboard/mistakes?filter=due",
      tag: "Spaced Repetition",
      urgency: "urgent",
      badgeCount: dueMistakes.length,
      subtext: "Leitner Box review • Target 100% resolution",
    };
  }

  // 3. Weak Subtest Targeting: Any subtest performing below 80% passing benchmark
  if (subtestAccuracies && subtestAccuracies.length > 0) {
    // Find the subtest with lowest accuracy that is strictly below 80%
    const subtestsBelowBenchmark = subtestAccuracies
      .filter((s) => s.accuracy < 80)
      .sort((a, b) => a.accuracy - b.accuracy);

    if (subtestsBelowBenchmark.length > 0) {
      const weakest = subtestsBelowBenchmark[0];
      return {
        type: "weak_subtest",
        title: `Strengthen Weak Area: ${weakest.name} (${weakest.accuracy}%)`,
        description: `Your average accuracy in ${weakest.name} is currently ${weakest.accuracy}%, below the required 80.00% benchmark. Focused topic drills will raise your score.`,
        actionLabel: `Practice ${weakest.name}`,
        actionHref: "/practice",
        tag: "Benchmark Gap",
        urgency: "medium",
        subtext: "Target: 80%+ passing benchmark",
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
        "Your subtest accuracy consistently meets the passing standard. Validate your endurance and time management under official 3h 10m continuous timing.",
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
      "Maintain active cognitive recall and sharpen your 67-second question pacing with a quick mixed-subject session.",
    actionLabel: "Start Quick Drill (10 min)",
    actionHref: "/exams/professional/quick",
    tag: "Daily Pacing",
    urgency: "normal",
    subtext: "10 mixed items • Maintain daily study streak",
  };
}
