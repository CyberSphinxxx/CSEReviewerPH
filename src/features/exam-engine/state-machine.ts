import type { EngineQuestion, UserAnswerState } from "./types";
import { initializeTimer, tickTimer, type TimerState } from "./timer";

export interface ExamSessionState {
  currentIndex: number;
  totalQuestions: number;
  answers: Map<string, UserAnswerState>;
  timer: TimerState;
  isReviewing: boolean;
  isSubmitted: boolean;
  allowsFlagging: boolean;
}

export function createExamSession(
  questions: EngineQuestion[],
  timeLimitMinutes: number,
  allowsFlagging = true
): ExamSessionState {
  const answers = new Map<string, UserAnswerState>();
  for (const q of questions) {
    answers.set(q.id, {
      questionId: q.id,
      selectedChoiceId: null,
      isFlagged: false,
      timeSpentSeconds: 0,
    });
  }

  return {
    currentIndex: 0,
    totalQuestions: questions.length,
    answers,
    timer: initializeTimer(timeLimitMinutes),
    isReviewing: false,
    isSubmitted: false,
    allowsFlagging,
  };
}

export function selectChoice(
  state: ExamSessionState,
  questionId: string,
  choiceId: string
): ExamSessionState {
  const currentAnswer = state.answers.get(questionId) || {
    questionId,
    selectedChoiceId: null,
    isFlagged: false,
    timeSpentSeconds: 0,
  };

  const updatedAnswers = new Map(state.answers);
  updatedAnswers.set(questionId, {
    ...currentAnswer,
    selectedChoiceId: choiceId,
  });

  return {
    ...state,
    answers: updatedAnswers,
  };
}

export function toggleFlag(
  state: ExamSessionState,
  questionId: string
): ExamSessionState {
  if (!state.allowsFlagging) return state;

  const currentAnswer = state.answers.get(questionId) || {
    questionId,
    selectedChoiceId: null,
    isFlagged: false,
    timeSpentSeconds: 0,
  };

  const updatedAnswers = new Map(state.answers);
  updatedAnswers.set(questionId, {
    ...currentAnswer,
    isFlagged: !currentAnswer.isFlagged,
  });

  return {
    ...state,
    answers: updatedAnswers,
  };
}

export function navigateNext(state: ExamSessionState): ExamSessionState {
  if (state.currentIndex < state.totalQuestions - 1) {
    return { ...state, currentIndex: state.currentIndex + 1 };
  }
  return state;
}

export function navigatePrev(state: ExamSessionState): ExamSessionState {
  if (state.currentIndex > 0) {
    return { ...state, currentIndex: state.currentIndex - 1 };
  }
  return state;
}

export function jumpToQuestion(state: ExamSessionState, index: number): ExamSessionState {
  if (index >= 0 && index < state.totalQuestions) {
    return { ...state, currentIndex: index, isReviewing: false };
  }
  return state;
}

export function setReviewing(state: ExamSessionState, isReviewing: boolean): ExamSessionState {
  return { ...state, isReviewing };
}

export function getExamSessionSummary(state: ExamSessionState) {
  let answeredCount = 0;
  let flaggedCount = 0;

  for (const ans of state.answers.values()) {
    if (ans.selectedChoiceId !== null) answeredCount++;
    if (ans.isFlagged) flaggedCount++;
  }

  const unansweredCount = state.totalQuestions - answeredCount;

  return {
    total: state.totalQuestions,
    answered: answeredCount,
    unanswered: unansweredCount,
    flagged: flaggedCount,
    canSubmit: true,
  };
}

export function stepTimer(state: ExamSessionState, elapsedSeconds = 1): ExamSessionState {
  const updatedTimer = tickTimer(state.timer, elapsedSeconds);
  const currentQuestionId = Array.from(state.answers.keys())[state.currentIndex];
  
  const updatedAnswers = new Map(state.answers);
  if (currentQuestionId) {
    const currentAns = updatedAnswers.get(currentQuestionId);
    if (currentAns) {
      updatedAnswers.set(currentQuestionId, {
        ...currentAns,
        timeSpentSeconds: currentAns.timeSpentSeconds + elapsedSeconds,
      });
    }
  }

  // Auto-submit if timer expires!
  const isSubmitted = state.isSubmitted || updatedTimer.isExpired;

  return {
    ...state,
    timer: updatedTimer,
    answers: updatedAnswers,
    isSubmitted,
  };
}
