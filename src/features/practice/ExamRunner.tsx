"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  type EngineQuestion,
  type ExamRuleConfig,
  type ExamSessionState,
  createExamSession,
  selectChoice,
  toggleFlag,
  navigateNext,
  navigatePrev,
  jumpToQuestion,
  stepTimer,
  getExamSessionSummary,
  formatTimeRemaining,
  calculateScore,
} from "@/features/exam-engine";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  LayoutGrid,
  X,
  Sparkles,
} from "lucide-react";

import {
  LocalStorageService,
  type ActiveExamSessionDraft,
  type StoredUserAnswer,
  type StoredAttemptDetails,
} from "@/lib/storage";

interface ExamRunnerProps {
  initialQuestions: EngineQuestion[];
  rules: ExamRuleConfig;
  title: string;
  subtitle?: string;
  onComplete?: (attemptId: string) => void;
}

export function ExamRunner({
  initialQuestions,
  rules,
  title,
  subtitle,
}: ExamRunnerProps) {
  const router = useRouter();
  const levelSlug = title.toLowerCase().includes("subprof") ? "subprofessional" : "professional";
  const topicId =
    initialQuestions[0]?.topicId && rules.mode === "practice"
      ? initialQuestions[0].topicId
      : undefined;

  const [savedDraft, setSavedDraft] = useState<ActiveExamSessionDraft | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const startedAtRef = useRef<string>(new Date().toISOString());

  // Initialize session state
  const [session, setSession] = useState<ExamSessionState>(() =>
    createExamSession(initialQuestions, rules.timeLimitMinutes, rules.allowsFlagging)
  );

  // Check for existing active draft on mount
  useEffect(() => {
    const draft = LocalStorageService.getActiveDraft(levelSlug, rules.mode, topicId);
    if (
      draft &&
      draft.questions.length === initialQuestions.length &&
      Object.keys(draft.answers).length > 0
    ) {
      setSavedDraft(draft);
      setShowResumeBanner(true);
    }
  }, [levelSlug, rules.mode, topicId, initialQuestions.length]);

  const handleResumeDraft = () => {
    if (!savedDraft) return;
    const restoredAnswers = new Map();
    for (const [qId, a] of Object.entries(savedDraft.answers)) {
      restoredAnswers.set(qId, {
        questionId: a.questionId,
        selectedChoiceId: a.selectedChoiceId,
        isFlagged: Boolean(a.isFlagged),
        timeSpentSeconds: a.timeSpentSeconds || 0,
      });
    }
    setSession({
      totalQuestions: savedDraft.questions.length,
      currentIndex: Math.min(savedDraft.currentQuestionIndex, savedDraft.questions.length - 1),
      answers: restoredAnswers,
      timer: {
        totalSeconds: savedDraft.rules.timeLimitMinutes * 60,
        remainingSeconds: savedDraft.remainingSeconds,
        isExpired: savedDraft.remainingSeconds <= 0,
        isWarning: savedDraft.remainingSeconds <= 300,
      },
      isReviewing: false,
      isSubmitted: false,
      allowsFlagging: savedDraft.rules.allowsFlagging,
    });
    startedAtRef.current = savedDraft.startedAt;
    setShowResumeBanner(false);
  };

  const handleDiscardDraft = () => {
    LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);
    setShowResumeBanner(false);
    setSavedDraft(null);
  };

  // Allow testExpirySeconds query param for automated e2e testing of timeout auto-submit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const testExpiry = params.get("testExpirySeconds");
      if (testExpiry) {
        const secs = parseInt(testExpiry, 10);
        if (!isNaN(secs) && secs > 0) {
          setSession((prev) => ({
            ...prev,
            timer: {
              totalSeconds: secs,
              remainingSeconds: secs,
              isExpired: false,
              isWarning: false,
            },
          }));
        }
      }
    }
  }, []);

  const [showNavigator, setShowNavigator] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Auto-save active draft to LocalStorageService
  useEffect(() => {
    if (isSubmittingRef.current || session.timer.isExpired) return;

    if (session.answers.size > 0 || session.timer.remainingSeconds < session.timer.totalSeconds) {
      const answersObj: Record<string, StoredUserAnswer> = {};
      const flaggedIds: string[] = [];

      session.answers.forEach((ans, qId) => {
        answersObj[qId] = {
          questionId: ans.questionId,
          selectedChoiceId: ans.selectedChoiceId ?? undefined,
          isFlagged: Boolean(ans.isFlagged),
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
        if (ans.isFlagged) {
          flaggedIds.push(qId);
        }
      });

      LocalStorageService.saveActiveDraft({
        id: `draft-${levelSlug}-${rules.mode}`,
        levelSlug,
        mode: rules.mode,
        title,
        subtitle,
        rules,
        questions: initialQuestions,
        answers: answersObj,
        flaggedQuestionIds: flaggedIds,
        currentQuestionIndex: session.currentIndex,
        remainingSeconds: session.timer.remainingSeconds,
        startedAt: startedAtRef.current,
        lastSavedAt: new Date().toISOString(),
      });
    }
  }, [session, levelSlug, rules, title, subtitle, initialQuestions, topicId]);

  // Submit handler
  const handleSubmit = useCallback(() => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const currentSession = sessionRef.current;
    const answersList = Array.from(currentSession.answers.values());
    const timeSpent = Math.max(1, currentSession.timer.totalSeconds - currentSession.timer.remainingSeconds);
    const scoreResult = calculateScore(
      initialQuestions,
      answersList,
      rules.passingScorePercentage,
      timeSpent
    );

    // Save attempt into LocalStorageService
    const attemptId = `attempt-${Date.now()}`;
    const attemptRecord: StoredAttemptDetails = {
      id: attemptId,
      title,
      mode: rules.mode,
      rules,
      questions: initialQuestions,
      answers: answersList.map((a) => ({
        questionId: a.questionId,
        selectedChoiceId: a.selectedChoiceId || undefined,
        isFlagged: a.isFlagged,
        timeSpentSeconds: a.timeSpentSeconds,
      })),
      scoreResult,
      completedAt: new Date().toISOString(),
    };

    LocalStorageService.recordCompletedAttempt(attemptRecord);
    LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);

    // Redirect to results page
    router.push(`/results/${attemptId}`);
  }, [initialQuestions, rules, title, router, levelSlug, topicId]);

  // Continuous Single Timer Tick with Wall-Clock Drift Reconciliation
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (session.timer.isExpired) return;

    lastTickRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const elapsedSeconds = Math.max(1, Math.floor((now - lastTickRef.current) / 1000));
      lastTickRef.current = now;

      setSession((prev) => {
        if (prev.timer.isExpired) return prev;
        return stepTimer(prev, elapsedSeconds);
      });
    };

    const interval = setInterval(tick, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session.timer.isExpired]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (session.timer.isExpired && !isSubmittingRef.current) {
      handleSubmit();
    }
  }, [session.timer.isExpired, handleSubmit]);

  const currentQuestion = initialQuestions[session.currentIndex] || initialQuestions[0];
  const currentAnswer = session.answers.get(currentQuestion?.id);
  const summary = getExamSessionSummary(session);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
          </div>

          {/* Continuous Timer Display */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold tracking-wider shadow-sm transition-colors ${
                session.timer.isWarning
                  ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <Clock className={`w-4 h-4 ${session.timer.isWarning ? "text-rose-600" : "text-brand-600"}`} />
              <span id="exam-timer">{formatTimeRemaining(session.timer.remainingSeconds)}</span>
            </div>

            {/* Question Navigator Button (Mobile & Desktop) */}
            <button
              onClick={() => setShowNavigator(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition shadow-sm"
              aria-label="Open Question Palette / Questions"
            >
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Questions</span>
            </button>

            {/* Review & Submit Button */}
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md shadow-brand-700/20 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Resume Session Banner */}
      {showResumeBanner && savedDraft && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 shadow-inner">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Unfinished Session Found:</strong> You have an in-progress test with{" "}
                <span className="font-semibold text-amber-950">
                  {Object.keys(savedDraft.answers).length} answered
                </span>{" "}
                and{" "}
                <span className="font-semibold text-amber-950">
                  {formatTimeRemaining(savedDraft.remainingSeconds)} remaining
                </span>
                .
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResumeDraft}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition shadow-sm"
              >
                Resume Session
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium transition"
              >
                Discard &amp; Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Testing Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentQuestion && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 transition-all">
            {/* Question Header & Subtest Tag */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-bold text-xs tracking-wide">
                  {currentQuestion.subjectName}
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500">{currentQuestion.topicName}</span>
                {currentQuestion.language === "fil" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    FILIPINO
                  </span>
                )}
              </div>

              {/* Flag Question Button */}
              {rules.allowsFlagging && (
                <button
                  onClick={() => setSession((prev) => toggleFlag(prev, currentQuestion.id))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    currentAnswer?.isFlagged
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  id="flag-question-button"
                >
                  <Flag className={`w-3.5 h-3.5 ${currentAnswer?.isFlagged ? "fill-amber-600 text-amber-600" : ""}`} />
                  <span>{currentAnswer?.isFlagged ? "Flagged" : "Flag"}</span>
                </button>
              )}
            </div>

            {/* Question Counter */}
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Question {session.currentIndex + 1} of {session.totalQuestions}
            </div>

            {/* Question Text */}
            <div className="mt-3 text-lg sm:text-xl font-medium text-slate-900 leading-relaxed whitespace-pre-line">
              {currentQuestion.questionText}
            </div>

            {/* Choices */}
            <div className="mt-6 space-y-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = currentAnswer?.selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() =>
                      setSession((prev) => selectChoice(prev, currentQuestion.id, choice.id))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                        isSelected
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                      }`}
                    >
                      {choice.choiceLabel}
                    </span>
                    <span className="flex-1 text-base text-slate-800 pt-0.5 leading-snug">
                      {choice.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Navigation Toolbar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={() => setSession((prev) => navigatePrev(prev))}
            disabled={session.currentIndex === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            id="prev-question-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-semibold text-slate-500">
            {summary.answered} of {summary.total} answered
          </div>

          <button
            onClick={() => {
              if (session.currentIndex === session.totalQuestions - 1) {
                setShowReviewModal(true);
              } else {
                setSession((prev) => navigateNext(prev));
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition active:scale-95"
            id="next-question-btn"
          >
            <span>{session.currentIndex === session.totalQuestions - 1 ? "Review" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Question Palette Modal / Drawer */}
      {showNavigator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-brand-600" />
                  <span>Question Navigator</span>
                </h3>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-3 gap-2 my-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3.5 h-3.5 rounded bg-brand-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400" />
                  <span>Flagged</span>
                </div>
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mt-4 max-h-[60vh] overflow-y-auto p-1">
                {initialQuestions.map((q, idx) => {
                  const ans = session.answers.get(q.id);
                  const isAnswered = ans?.selectedChoiceId !== null && ans?.selectedChoiceId !== undefined;
                  const isFlagged = ans?.isFlagged;
                  const isCurrent = session.currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSession((prev) => jumpToQuestion(prev, idx));
                        setShowNavigator(false);
                      }}
                      className={`h-11 rounded-lg font-bold text-xs flex flex-col items-center justify-center transition border ${
                        isCurrent
                          ? "ring-2 ring-brand-500 ring-offset-2"
                          : ""
                      } ${
                        isFlagged
                          ? "bg-amber-100 border-amber-400 text-amber-900"
                          : isAnswered
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && <Flag className="w-2.5 h-2.5 fill-amber-700 text-amber-700 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Palette */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowNavigator(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
              >
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Before Submit Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-brand-700 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Review Before Submission</h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to finish and submit your exam? Here is your current progress:
            </p>

            {/* Summary Statistics */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-2xl font-black text-emerald-700">{summary.answered}</span>
                <span className="text-xs font-semibold text-emerald-800">Answered</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="block text-2xl font-black text-amber-700">{summary.flagged}</span>
                <span className="text-xs font-semibold text-amber-800">Flagged</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-2xl font-black text-slate-700">{summary.unanswered}</span>
                <span className="text-xs font-semibold text-slate-600">Unanswered</span>
              </div>
            </div>

            {summary.unanswered > 0 && (
              <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  You have <strong>{summary.unanswered} unanswered</strong> question(s). Unanswered questions are scored as incorrect.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 font-bold text-white text-sm shadow-md shadow-brand-700/20 transition disabled:opacity-50"
                id="confirm-submit-btn"
              >
                {isSubmitting ? "Calculating Results..." : "Submit & View Results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
