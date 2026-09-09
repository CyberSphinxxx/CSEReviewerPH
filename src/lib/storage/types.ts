import type { EngineQuestion, ExamRuleConfig, ScoringResult } from "@/features/exam-engine";

export interface StoredUserAnswer {
  questionId: string;
  selectedChoiceId?: string;
  isFlagged: boolean;
  timeSpentSeconds: number;
}

export interface ActiveExamSessionDraft {
  id: string; // e.g., session-level-mode
  levelSlug: string;
  mode: string;
  title: string;
  subtitle?: string;
  rules: ExamRuleConfig;
  questions: EngineQuestion[];
  answers: Record<string, StoredUserAnswer>;
  flaggedQuestionIds: string[];
  currentQuestionIndex: number;
  remainingSeconds: number;
  startedAt: string;
  lastSavedAt: string;
}

export interface AttemptSummary {
  id: string;
  title: string;
  mode: string;
  percentage: number;
  rawScore: number;
  totalQuestions: number;
  passed: boolean;
  date: string;
}

export interface StoredAttemptDetails {
  id: string;
  title: string;
  mode: string;
  rules: ExamRuleConfig;
  questions: EngineQuestion[];
  answers: StoredUserAnswer[];
  scoreResult: ScoringResult;
  completedAt: string;
}

export interface StoredMistakeItem {
  id: string; // Question ID
  question: EngineQuestion;
  attemptId: string;
  selectedChoiceId?: string;
  correctChoiceId?: string;
  addedAt: string;
  reviewCount: number;
}

export interface StoredBookmarkItem {
  id: string; // Question ID
  question: EngineQuestion;
  bookmarkedAt: string;
  notes?: string;
}

export interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[]; // List of YYYY-MM-DD
}

export interface SubjectReadinessMetric {
  subjectId: string;
  subjectName: string;
  subjectSlug: string;
  questionsAnswered: number;
  correctCount: number;
  accuracyPercentage: number;
}

export interface GuestBackupPayload {
  version: 1;
  exportedAt: string;
  history: AttemptSummary[];
  attempts: Record<string, StoredAttemptDetails>;
  mistakeBank: StoredMistakeItem[];
  bookmarks: StoredBookmarkItem[];
  streak: StudyStreakData;
}
