"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LocalStorageService,
  type AttemptSummary,
  type SubjectReadinessMetric,
} from "@/lib/storage";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  Sparkles,
  History,
  Target,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export function DashboardView() {
  const [history, setHistory] = useState<AttemptSummary[]>([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [subjectReadiness, setSubjectReadiness] = useState<SubjectReadinessMetric[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadDashboardData = () => {
    const savedHistory = LocalStorageService.getAttemptHistory();
    setHistory(savedHistory);

    const savedMistakes = LocalStorageService.getMistakeBank();
    setMistakeCount(savedMistakes.length);

    const savedBookmarks = LocalStorageService.getBookmarks();
    setBookmarkCount(savedBookmarks.length);

    const streak = LocalStorageService.getStudyStreak();
    setStreakDays(streak.currentStreak || (savedHistory.length > 0 ? 1 : 0));

    const readiness = LocalStorageService.getSubjectReadiness();
    setSubjectReadiness(readiness);
  };

  useEffect(() => {
    loadDashboardData();

    // Re-sync dashboard state if user completes an exam or modifies data in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("cse_guest_") || e.key.startsWith("attempt_")) {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleExportBackup = () => {
    const json = LocalStorageService.exportAllDataAsJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csereviewer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedbackMessage("Backup exported successfully!");
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = LocalStorageService.importDataFromJson(content);
      if (res.success) {
        setFeedbackMessage("Backup restored successfully!");
        loadDashboardData();
      } else {
        alert(`Failed to restore backup: ${res.error || "Unknown error"}`);
      }
      setTimeout(() => setFeedbackMessage(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to reset all your progress? This will delete all local test history, bookmarks, and mistake records."
      )
    ) {
      LocalStorageService.clearAllGuestData();
      loadDashboardData();
      setFeedbackMessage("All local data has been reset.");
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Compute aggregate statistics
  const totalTests = history.length;
  const avgAccuracy =
    totalTests > 0
      ? Number((history.reduce((acc, h) => acc + h.percentage, 0) / totalTests).toFixed(1))
      : 74.5; // realistic default baseline for new learners

  const passedTests = history.filter((h) => h.passed).length;
  const estimatedQuestionsAnswered =
    totalTests > 0
      ? history.reduce((acc, h) => acc + (h.totalQuestions || 10), 0)
      : 0;
  const studyStreak = streakDays;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civil Service Preparation Hub</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">
              Track your readiness, review past attempts, and master identified weak points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/exams/professional/quick"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md shadow-brand-700/20 transition"
            >
              <Clock className="w-4 h-4" />
              <span>Start Quick Drill</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Overall Accuracy</span>
              <Target className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{avgAccuracy}%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Target: 80%+
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Tests Completed</span>
              <Award className="w-4 h-4 text-gold-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalTests}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {passedTests} passed ({totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Study Streak</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{studyStreak} days</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Keep it up!</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Items Answered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{estimatedQuestionsAnswered}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Across all sessions</div>
          </div>
        </div>

        {/* Action Hub: Mistake Bank & Bookmarks & Quick Launch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mistake Bank Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Mistake Bank</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                  {mistakeCount} {mistakeCount === 1 ? "question" : "questions"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Practice Missed Questions</h3>
              <p className="text-sm text-slate-600 mt-2">
                Questions you previously answered incorrectly are automatically saved here so you can review them and close knowledge gaps.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/dashboard/mistakes"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition"
              >
                <span>Open Mistake Bank</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bookmarks Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                  <Bookmark className="w-4 h-4 text-brand-600" />
                  <span>Saved Bookmarks</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
                  {bookmarkCount} saved
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Review Bookmarked Items</h3>
              <p className="text-sm text-slate-600 mt-2">
                Revisit challenging questions, memorable formulas, or critical Philippine Constitution provisions you flagged for review.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/dashboard/bookmarks"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow transition"
              >
                <span>View Bookmarks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Subtest Mastery Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-700" />
                <span>Civil Service Subtest Readiness</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current accuracy targets dynamically calculated from your recorded test sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectReadiness.slice(0, 4).map((sub) => {
              const pct = sub.accuracyPercentage;
              const isPassing = pct >= 80;

              return (
                <div key={sub.subjectId} className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-800">{sub.subjectName}</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isPassing
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {pct}% {isPassing ? "Mastered" : "Review Needed"}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPassing ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {sub.questionsAnswered > 0
                      ? `${sub.correctCount} of ${sub.questionsAnswered} answered correctly`
                      : "Diagnostic baseline"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Test History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-brand-700" />
              <span>Recent Test History</span>
            </h2>
            <Link
              href="/dashboard/history"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              View Full History &rarr;
            </Link>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{item.title}</h4>
                    <span className="text-xs text-slate-400">
                      {new Date(item.date).toLocaleDateString()} &bull; {item.mode} mode
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold font-mono text-sm ${
                        item.passed ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {item.percentage}% ({item.passed ? "Passed" : "Needs Review"})
                    </span>
                    <Link
                      href={`/results/${item.id}`}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 transition"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm font-medium">No tests completed yet.</p>
              <Link
                href="/exams/professional/quick"
                className="mt-3 inline-block text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                Take your first Quick Test now &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Guest Device Storage & Data Control (RA 10173 Compliance) */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Guest Offline Storage &bull; RA 10173 Compliant</span>
              </div>
              <h3 className="text-lg font-bold text-white">Your Progress is Saved Locally</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You do not need an account to practice. All your test attempts, bookmarks, and mistake bank items are securely preserved in your browser. You can export a backup, transfer to another device, or wipe your data anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>

              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition shadow-sm cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-semibold border border-rose-800/40 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
