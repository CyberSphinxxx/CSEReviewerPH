"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { SubjectReadinessMetric } from "@/lib/storage";

interface SubjectProgressListProps {
  subjects: SubjectReadinessMetric[];
}

export function SubjectProgressList({ subjects }: SubjectProgressListProps) {
  return (
    <section
      aria-labelledby="subject-progress-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3
            id="subject-progress-heading"
            className="text-lg font-extrabold text-slate-900 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-brand-700" />
            <span>Your subject progress</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice accuracy calculated from your recorded test sessions.
          </p>
        </div>

        <Link
          href="/practice"
          prefetch={true}
          className="text-xs font-semibold text-brand-700 hover:text-brand-800 hidden sm:inline-flex items-center gap-1"
        >
          <span>All topics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {subjects.map((sub) => {
          const hasData = sub.questionsAnswered > 0;
          const pct = sub.accuracyPercentage;
          const meetsTarget = pct >= 80;

          return (
            <div
              key={sub.subjectId}
              className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition bg-white"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-slate-800">{sub.subjectName}</span>
                {hasData ? (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      meetsTarget
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {pct}% Practice accuracy
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    Not measured yet
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !hasData
                      ? "bg-transparent"
                      : meetsTarget
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${hasData ? pct : 0}%` }}
                />
              </div>

              {/* Sample Size and Action Link */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {hasData ? (
                    <>
                      {sub.correctCount} of {sub.questionsAnswered} correct &bull; Study target: 80%
                    </>
                  ) : (
                    "0 questions answered &bull; Take a diagnostic to measure baseline"
                  )}
                </span>
                <Link
                  href="/practice"
                  prefetch={true}
                  className="font-semibold text-brand-700 hover:text-brand-800 transition text-[11px]"
                >
                  {hasData ? "Practice drills →" : "Start diagnostic →"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
