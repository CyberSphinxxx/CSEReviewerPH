import {
  SEED_LEVELS,
  SEED_SUBJECTS,
  SEED_TOPICS,
  SEED_RULES,
  SEED_QUESTIONS,
} from "@/db/seed-data";
import {
  selectQuestionsForExam,
  createExamSession,
  type EngineQuestion,
  type ExamRuleConfig,
  type ExamSessionState,
  type ExamMode,
} from "@/features/exam-engine";

export interface ExamLevelInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  subjects: {
    id: string;
    slug: string;
    name: string;
    topics: {
      id: string;
      slug: string;
      name: string;
      questionCount: number;
    }[];
  }[];
}

export function getExamLevelInfo(levelSlug: string): ExamLevelInfo | null {
  const level = SEED_LEVELS.find((l) => l.slug === levelSlug);
  if (!level) return null;

  const subjects = SEED_SUBJECTS.filter((s) => s.examLevelId === level.id).map((sub) => {
    const topics = SEED_TOPICS.filter((t) => t.subjectId === sub.id).map((top) => {
      const qCount = SEED_QUESTIONS.filter((q) => q.topicId === top.id).length;
      return {
        id: top.id,
        slug: top.slug,
        name: top.name,
        questionCount: qCount,
      };
    });
    return {
      id: sub.id,
      slug: sub.slug,
      name: sub.name,
      topics,
    };
  });

  return {
    id: level.id,
    slug: level.slug,
    name: level.name,
    description: level.description,
    subjects,
  };
}

export function getAllExamLevels(): ExamLevelInfo[] {
  return SEED_LEVELS.map((lvl) => getExamLevelInfo(lvl.slug)!);
}

export function getTopicQuestions(topicId: string): EngineQuestion[] {
  return SEED_QUESTIONS.filter((q) => q.topicId === topicId);
}

export function prepareExamSession(
  levelSlug: string,
  mode: ExamMode,
  options?: {
    topicId?: string;
    exposureHistory?: Set<string>;
    questionLimit?: number;
  }
): { session: ExamSessionState; questions: EngineQuestion[]; rules: ExamRuleConfig } {
  const level = SEED_LEVELS.find((l) => l.slug === levelSlug) || SEED_LEVELS[0];
  // Find candidate questions
  let candidatePool = SEED_QUESTIONS;
  if (options?.topicId) {
    candidatePool = SEED_QUESTIONS.filter((q) => q.topicId === options.topicId);
  }

  // Default item count and timing per mode
  const defaultItemCount =
    mode === "quick"
      ? 10
      : mode === "medium"
      ? 30
      : mode === "practice"
      ? Math.min(options?.questionLimit ?? 10, candidatePool.length > 0 ? candidatePool.length : 10)
      : 170;

  const defaultTimeLimit =
    mode === "quick" ? 10 : mode === "medium" ? 30 : mode === "practice" ? 15 : 190;

  const matchingRules = SEED_RULES.find((r) => r.examLevelId === level.id && r.mode === mode) || {
    id: `rule-default-${mode}`,
    examLevelId: level.id,
    mode,
    itemCount: defaultItemCount,
    timeLimitMinutes: defaultTimeLimit,
    passingScorePercentage: 80,
    allowsFlagging: true,
    hasContinuousTimer: true,
    subjectDistribution: {},
    difficultyDistribution: {},
  };

  // Target item count
  const targetCount =
    options?.questionLimit !== undefined
      ? options.questionLimit
      : mode === "practice"
      ? defaultItemCount
      : matchingRules.itemCount;
  const effectiveCount = Math.max(1, targetCount);

  const ruleConfig: ExamRuleConfig = {
    ...matchingRules,
    itemCount: effectiveCount,
  };

  const selected = selectQuestionsForExam(candidatePool, ruleConfig, options?.exposureHistory);

  // If pool was small in dev mock, expand with available seed questions for full/medium test flows, but never for topic practice
  let finalQuestions = selected;
  if (
    mode !== "practice" &&
    !options?.topicId &&
    finalQuestions.length < effectiveCount &&
    candidatePool.length > 0
  ) {
    while (finalQuestions.length < effectiveCount) {
      const needed = effectiveCount - finalQuestions.length;
      const clone = candidatePool.slice(0, needed).map((q, idx) => ({
        ...q,
        id: `${q.id}-dup-${finalQuestions.length + idx}`,
      }));
      finalQuestions = [...finalQuestions, ...clone];
    }
  } else if (finalQuestions.length === 0 && candidatePool.length > 0) {
    finalQuestions = candidatePool.slice(0, effectiveCount);
  }

  const session = createExamSession(
    finalQuestions,
    ruleConfig.timeLimitMinutes,
    ruleConfig.allowsFlagging
  );

  return {
    session,
    questions: finalQuestions,
    rules: {
      ...ruleConfig,
      itemCount: finalQuestions.length,
    },
  };
}
