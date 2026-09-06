import type { EngineQuestion, ExamRuleConfig } from "./types";

export function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function selectQuestionsForExam(
  allQuestions: EngineQuestion[],
  rules: ExamRuleConfig,
  exposureHistoryQuestionIds?: Set<string>
): EngineQuestion[] {
  if (allQuestions.length === 0) return [];

  // Group questions by subject
  const bySubject = new Map<string, EngineQuestion[]>();
  for (const q of allQuestions) {
    const list = bySubject.get(q.subjectId) || [];
    list.push(q);
    bySubject.set(q.subjectId, list);
  }

  // Prioritize questions not in exposure history
  const sortByExposure = (list: EngineQuestion[]): EngineQuestion[] => {
    if (!exposureHistoryQuestionIds || exposureHistoryQuestionIds.size === 0) {
      return shuffleArray(list);
    }
    const unseen: EngineQuestion[] = [];
    const seen: EngineQuestion[] = [];
    for (const q of list) {
      if (exposureHistoryQuestionIds.has(q.id)) {
        seen.push(q);
      } else {
        unseen.push(q);
      }
    }
    return [...shuffleArray(unseen), ...shuffleArray(seen)];
  };

  const selectedQuestions: EngineQuestion[] = [];

  // 1. If subject distribution is configured in rules
  if (rules.subjectDistribution && Object.keys(rules.subjectDistribution).length > 0) {
    const subjects = Object.keys(rules.subjectDistribution);
    for (const subjectId of subjects) {
      const quota = rules.subjectDistribution[subjectId] || 0;
      const candidates = bySubject.get(subjectId) || [];
      const orderedCandidates = sortByExposure(candidates);
      selectedQuestions.push(...orderedCandidates.slice(0, quota));
    }
  }

  // 2. If selected questions count is less than required itemCount, fill remaining from available pool
  if (selectedQuestions.length < rules.itemCount) {
    const selectedIds = new Set(selectedQuestions.map((q) => q.id));
    const remainingCandidates = allQuestions.filter((q) => !selectedIds.has(q.id));
    const ordered = sortByExposure(remainingCandidates);
    const needed = rules.itemCount - selectedQuestions.length;
    selectedQuestions.push(...ordered.slice(0, needed));
  }

  // Shuffle final selection and assign choices
  const shuffledQuestions = shuffleArray(selectedQuestions).slice(0, rules.itemCount);

  // Return questions with randomized choices, re-labeled A, B, C, D
  return shuffledQuestions.map((q) => {
    const shuffledChoices = shuffleArray(q.choices).map((c, idx) => ({
      ...c,
      choiceLabel: String.fromCharCode(65 + idx), // A, B, C, D...
      order: idx,
    }));
    return {
      ...q,
      choices: shuffledChoices,
    };
  });
}
