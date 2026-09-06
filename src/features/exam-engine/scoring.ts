import type {
  EngineQuestion,
  UserAnswerState,
  ScoringResult,
  SubjectScoreBreakdown,
  TopicScoreBreakdown,
} from "./types";

export function calculateScore(
  questions: EngineQuestion[],
  answers: UserAnswerState[],
  passingScorePercentage = 80,
  timeSpentSeconds = 0
): ScoringResult {
  const totalQuestions = questions.length;
  const answerMap = new Map<string, UserAnswerState>();
  for (const ans of answers) {
    answerMap.set(ans.questionId, ans);
  }

  let answeredCount = 0;
  let correctCount = 0;

  const subjectStats = new Map<string, { subjectName: string; total: number; correct: number }>();
  const topicStats = new Map<string, { topicName: string; subjectName: string; total: number; correct: number }>();

  for (const q of questions) {
    // Subject map tracking
    const currentSub = subjectStats.get(q.subjectId) || {
      subjectName: q.subjectName,
      total: 0,
      correct: 0,
    };
    currentSub.total += 1;

    // Topic map tracking
    const currentTopic = topicStats.get(q.topicId) || {
      topicName: q.topicName,
      subjectName: q.subjectName,
      total: 0,
      correct: 0,
    };
    currentTopic.total += 1;

    const userAns = answerMap.get(q.id);
    const selectedChoiceId = userAns?.selectedChoiceId;

    if (selectedChoiceId) {
      answeredCount += 1;
      const correctChoice = q.choices.find((c) => c.isCorrect);
      if (correctChoice && correctChoice.id === selectedChoiceId) {
        correctCount += 1;
        currentSub.correct += 1;
        currentTopic.correct += 1;
      }
    }

    subjectStats.set(q.subjectId, currentSub);
    topicStats.set(q.topicId, currentTopic);
  }

  const unansweredCount = totalQuestions - answeredCount;
  const incorrectCount = totalQuestions - correctCount;
  const rawScore = correctCount;
  const percentageScore = totalQuestions > 0 ? Number(((correctCount / totalQuestions) * 100).toFixed(2)) : 0;
  const isPassed = percentageScore >= passingScorePercentage;

  const subjectBreakdown: SubjectScoreBreakdown[] = Array.from(subjectStats.entries()).map(
    ([subjectId, stats]) => ({
      subjectId,
      subjectName: stats.subjectName,
      total: stats.total,
      correct: stats.correct,
      percentage: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(2)) : 0,
    })
  );

  const topicBreakdown: TopicScoreBreakdown[] = Array.from(topicStats.entries()).map(
    ([topicId, stats]) => ({
      topicId,
      topicName: stats.topicName,
      subjectName: stats.subjectName,
      total: stats.total,
      correct: stats.correct,
      percentage: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(2)) : 0,
    })
  );

  // Derive strengths (>= 75%) and weak areas (< 75%)
  const strengths = subjectBreakdown
    .filter((s) => s.percentage >= 75)
    .map((s) => `${s.subjectName} (${s.percentage}%)`);

  const weakAreas = subjectBreakdown
    .filter((s) => s.percentage < 75)
    .map((s) => `${s.subjectName} (${s.percentage}%)`);

  // Recommended practice topics: sorted by lowest topic score
  const recommendedTopics = topicBreakdown
    .filter((t) => t.percentage < 80)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .map((t) => ({
      topicId: t.topicId,
      topicName: t.topicName,
      reason: `Accuracy is currently ${t.percentage}%. Target mastery is 80%+.`,
    }));

  return {
    totalQuestions,
    answeredCount,
    unansweredCount,
    correctCount,
    incorrectCount,
    rawScore,
    percentageScore,
    passingScorePercentage,
    isPassed,
    timeSpentSeconds,
    subjectBreakdown,
    topicBreakdown,
    strengths,
    weakAreas,
    recommendedTopics,
  };
}
