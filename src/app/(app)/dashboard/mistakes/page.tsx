"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExamRunner } from "@/features/practice/ExamRunner";
import { LocalStorageService, type StoredMistakeItem } from "@/lib/storage";
import { AlertTriangle, ChevronLeft, Play, BookOpen, Trash2, CheckCircle2 } from "lucide-react";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<StoredMistakeItem[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    setMistakes(LocalStorageService.getMistakeBank());
  }, []);

  const clearMistakes = () => {
    if (confirm("Are you sure you want to clear all questions from your Mistake Bank?")) {
      LocalStorageService.clearMistakeBank();
      setMistakes([]);
    }
  };

  const removeSingleMistake = (qId: string) => {
    LocalStorageService.removeMistake(qId);
    setMistakes((prev) => prev.filter((m) => m.id !== qId));
  };

  if (isPracticing && mistakes.length > 0) {
    const practiceQuestions = mistakes.map((m) => m.question);
    return (
      <ExamRunner
        initialQuestions={practiceQuestions}
        rules={{
          mode: "mistakes",
          itemCount: practiceQuestions.length,
          timeLimitMinutes: Math.max(10, Math.ceil(practiceQuestions.length * 1.5)),
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
        }}
        title="Mistake Bank Practice Drill"
        subtitle={`Reviewing ${practiceQuestions.length} previously missed items`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Mistake Bank</h1>
                <p className="text-xs text-slate-500">
                  Targeted drills on questions you answered incorrectly in past tests.
                </p>
              </div>
            </div>

            {mistakes.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={clearMistakes}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>

                <button
                  onClick={() => setIsPracticing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Practice My Mistakes ({mistakes.length})</span>
                </button>
              </div>
            )}
          </div>

          {mistakes.length > 0 ? (
            <div className="space-y-4">
              {mistakes.map((item, idx) => {
                const q = item.question;
                return (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                      <span className="text-brand-700">
                        {q.subjectName} &bull; {q.topicName}
                      </span>
                      <div className="flex items-center gap-3">
                        <span>Item #{idx + 1}</span>
                        <button
                          onClick={() => removeSingleMistake(item.id)}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition"
                          title="Mark as Mastered"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered</span>
                        </button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm whitespace-pre-line">
                      {q.questionText}
                    </h4>
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 text-xs text-slate-600 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                ✓
              </div>
              <p className="text-sm font-semibold text-slate-700">Your Mistake Bank is empty!</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any questions you miss during tests and drills will be saved here automatically for focused review.
              </p>
              <Link
                href="/exams/professional/quick"
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs shadow hover:bg-brand-800 transition"
              >
                Take a Quick Test
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
