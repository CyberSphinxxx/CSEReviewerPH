"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroDiagnosticPlanPreviewProps {
  level?: "professional" | "subprofessional";
}

export function HeroDiagnosticPlanPreview({
  level = "professional",
}: HeroDiagnosticPlanPreviewProps) {
  const practiceHref = `/exams/${level}/quick`;

  return (
    <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 text-slate-800 space-y-4">
      {/* Header Row: Outcome Preview Label & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            Example Outcome
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-1.5">
            YOUR DIAGNOSTIC PLAN
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
          Preview
        </span>
      </div>

      {/* Estimated Readiness Metric */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Estimated readiness
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            Practice benchmark &bull; <strong className="text-slate-700 font-bold">80% goal</strong>
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            62%
          </span>
          <span className="text-xs text-slate-500">diagnostic baseline</span>
        </div>

        {/* 10-block progress bar representing 62% readiness */}
        <div
          className="flex items-center gap-1 w-full pt-1"
          role="progressbar"
          aria-valuenow={62}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Estimated readiness: 62%"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-brand-600" />
          ))}
          {[7, 8, 9, 10].map((i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-slate-200" />
          ))}
        </div>
      </div>

      {/* Subtest Breakdown Meters */}
      <div className="space-y-2.5 pt-1">
        {/* Numerical Ability */}
        <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Numerical Ability</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
              Needs focus
            </span>
          </div>
          <div className="flex items-center gap-1 w-full" aria-label="Numerical Ability: Needs focus">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-amber-500" />
            ))}
            {[7, 8, 9, 10].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>

        {/* Verbal Ability */}
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Verbal Ability</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Strong
            </span>
          </div>
          <div className="flex items-center gap-1 w-full" aria-label="Verbal Ability: Strong">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-emerald-500" />
            ))}
            {[9, 10].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Next Recommended Drill */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Next recommended drill
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            Percentages &amp; Interest
          </p>
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            10 min
          </span>
        </div>
      </div>

      {/* Action CTA & Secondary Link */}
      <div className="pt-2 space-y-2.5 text-center">
        <Link
          href={practiceHref}
          prefetch={true}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm hover:bg-slate-800 transition transform active:scale-[0.98]"
        >
          <span>Start focused practice</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition"
          >
            Preview the practice interface
          </Link>
        </div>
      </div>
    </div>
  );
}
