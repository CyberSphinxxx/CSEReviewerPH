export type ExamMode = "practice" | "quick" | "medium" | "full" | "mistakes" | "bookmarks";

export type QuestionDifficulty = "easy" | "medium" | "hard" | "very_hard";

export type QuestionLanguage = "en" | "fil";

export interface EngineChoice {
  id: string;
  choiceLabel: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  text: string;
  isCorrect: boolean;
  order: number;
  explanation?: string | null;
}

export interface EngineQuestion {
  id: string;
  topicId: string;
  topicName: string;
  topicSlug: string;
  subjectId: string;
  subjectName: string;
  subjectSlug: string;
  questionText: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  language: QuestionLanguage;
  choices: EngineChoice[];
  isSeedData?: boolean;
}

export interface ExamRuleConfig {
  mode: ExamMode;
  itemCount: number;
  timeLimitMinutes: number;
  passingScorePercentage: number;
  subjectDistribution?: Record<string, number>; // subjectId/slug -> count or ratio
  difficultyDistribution?: Partial<Record<QuestionDifficulty, number>>; // difficulty -> count or percentage
  allowsFlagging: boolean;
  hasContinuousTimer: boolean;
}

export interface UserAnswerState {
  questionId: string;
  selectedChoiceId: string | null;
  isFlagged: boolean;
  timeSpentSeconds: number;
}

export interface SubjectScoreBreakdown {
  subjectId: string;
  subjectName: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface TopicScoreBreakdown {
  topicId: string;
  topicName: string;
  subjectName: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface ScoringResult {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  rawScore: number;
  percentageScore: number;
  passingScorePercentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  subjectBreakdown: SubjectScoreBreakdown[];
  topicBreakdown: TopicScoreBreakdown[];
  strengths: string[];
  weakAreas: string[];
  recommendedTopics: { topicId: string; topicName: string; reason: string }[];
}
