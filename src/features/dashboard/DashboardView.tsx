"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LocalStorageService,
  type AttemptSummary,
  type SubjectReadinessMetric,
  type TargetExamConfig,
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
  Calendar,
  Settings2,
} from "lucide-react";

export function DashboardView() {
  const [history, setHistory] = useState<AttemptSummary[]>([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [subjectReadiness, setSubjectReadiness] = useState<SubjectReadinessMetric[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Target Exam Countdown & Daily Goal State
  const [targetConfig, setTargetConfig] = useState<TargetExamConfig>({
    targetDate: "2027-03-21",
    examName: "March 2027 CSE-PPT",
    dailyGoal: 25,
  });
  const [dailyAnswered, setDailyAnswered] = useState(0);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editDate, setEditDate] = useState("2027-03-21");
  const [editName, setEditName] = useState("March 2027 CSE-PPT");
  const [editGoal, setEditGoal] = useState(25);

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

    const config = LocalStorageService.getTargetExamConfig();
    setTargetConfig(config);
    setEditDate(config.targetDate);
    setEditName(config.examName);
    setEditGoal(config.dailyGoal);
    setDailyAnswered(LocalStorageService.getDailyQuestionsAnswered());
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
    a.download = `csereviewph-backup-${new Date().toISOString().slice(0, 10)}.json`;
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

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: TargetExamConfig = {
      targetDate: editDate,
      examName: editName.trim() || "Target Exam",
      dailyGoal: Math.max(5, Math.min(200, Number(editGoal) || 25)),
    };
    LocalStorageService.saveTargetExamConfig(newConfig);
    setTargetConfig(newConfig);
    setIsEditingTarget(false);
    setFeedbackMessage("Target exam date & daily pacing goal updated!");
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Target Exam Countdown Math
  const targetTime = new Date(targetConfig.targetDate).getTime();
  const diffTimeMs = targetTime - Date.now();
  const daysUntilExam = Math.max(0, Math.ceil(diffTimeMs / (1000 * 60 * 60 * 24)));
  const weeksUntilExam = Math.floor(daysUntilExam / 7);
  const dailyProgressPercent = Math.min(
    100,
    Math.round((dailyAnswered / (targetConfig.dailyGoal || 25)) * 100)
  );

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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-page-enter">
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
              prefetch={true}
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

        {/* Target Exam Date Countdown & Daily Pacing Card */}
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Exam Pacing</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">{targetConfig.examName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {daysUntilExam > 0 ? (
                  <>
                    <span className="text-gold-400">{daysUntilExam} Days</span> Remaining
                    <span className="text-sm font-normal text-slate-400 ml-2">
                      ({weeksUntilExam} weeks until exam)
                    </span>
                  </>
                ) : (
                  <span className="text-gold-400">Exam Day is Here!</span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Maintain consistent daily practice to build familiarity and stamina for the continuous 3-hour CSE-PPT.
              </p>
            </div>

            {/* Daily Goal Gauge & Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
              <div className="space-y-1.5 min-w-[180px]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Daily Goal</span>
                  <span className="text-gold-400">{dailyAnswered} / {targetConfig.dailyGoal} items</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      dailyAnswered >= targetConfig.dailyGoal ? "bg-emerald-400" : "bg-gold-400"
                    }`}
                    style={{ width: `${dailyProgressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  {dailyAnswered >= targetConfig.dailyGoal
                    ? "✓ Daily goal accomplished!"
                    : `${targetConfig.dailyGoal - dailyAnswered} more items to hit today's target`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/exams/professional/quick"
                  prefetch={true}
                  className="px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-sm transition text-center"
                >
                  Practice Now
                </Link>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(!isEditingTarget)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                  title="Adjust Target Exam or Daily Goal"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Inline Edit Form */}
          {isEditingTarget && (
            <form
              onSubmit={handleSaveTarget}
              className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-slate-900 animate-fade-in"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Exam Preset</label>
                <select
                  value={editDate}
                  onChange={(e) => {
                    setEditDate(e.target.value);
                    if (e.target.value === "2027-03-21") setEditName("March 2027 CSE-PPT");
                    if (e.target.value === "2027-08-08") setEditName("August 2027 CSE-PPT");
                  }}
                  className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300"
                >
                  <option value="2027-03-21">March 21, 2027 (CSE-PPT Cycle 1)</option>
                  <option value="2027-08-08">August 8, 2027 (CSE-PPT Cycle 2)</option>
                  <option value="custom">Custom Date...</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={editDate === "custom" ? "" : editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Daily Question Goal</label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={editGoal}
                  onChange={(e) => setEditGoal(Number(e.target.value))}
                  className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Save Target
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(false)}
                  className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
                prefetch={true}
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
                prefetch={true}
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
              prefetch={true}
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
