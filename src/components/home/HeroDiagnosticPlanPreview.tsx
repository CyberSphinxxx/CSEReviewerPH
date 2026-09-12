"use client";

import Link from "next/link";
import { CheckCircle2, Target, BrainCircuit, Clock, ArrowRight } from "lucide-react";

interface HeroDiagnosticPlanPreviewProps {
  level?: "professional" | "subprofessional";
}

export function HeroDiagnosticPlanPreview({
  level = "professional",
}: HeroDiagnosticPlanPreviewProps) {
  const diagnosticHref = `/exams/${level}/quick`;

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 pb-6 sm:pb-7 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 text-slate-800 space-y-4">
      {/* Header Row: Kicker & Completion State */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-600" />
          <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Your diagnostic becomes a study plan
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>10-question diagnostic complete</span>
        </div>
      </div>

      {/* The 4-Step Product Loop Indicator */}
      <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-slate-500">
          <span className="text-slate-400">Practice</span>
          <span className="text-slate-300">&rarr;</span>
          <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
            Diagnosis
          </span>
          <span className="text-slate-300">&rarr;</span>
          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
            Targeted Review
          </span>
          <span className="text-slate-300">&rarr;</span>
          <span className="text-slate-400">Readiness</span>
        </div>
      </div>

      {/* Overall Score Assessment */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Overall estimate: 62%
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            CSC passing cutoff: <strong className="text-slate-800 font-bold">80%</strong>
          </span>
        </div>

        {/* Meter with 80% passing indicator */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden relative border border-slate-200/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brand-600"
            style={{ width: "62%" }}
            role="progressbar"
            aria-valuenow={62}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall estimate: 62%"
          />
          {/* 80% passing benchmark tick */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-500/80 z-10"
            style={{ left: "80%" }}
            title="80% CSC Passing Cutoff"
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0%</span>
          <span className="text-amber-700 font-medium">62% Current</span>
          <span className="text-slate-700 font-bold">80% Passing Goal</span>
          <span>100%</span>
        </div>
      </div>

      {/* Identified Subtest Strengths & Focus Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Strong Subtest */}
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Strong
            </span>
            <span className="text-xs font-bold text-emerald-700">85%</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900">Strong: Verbal Ability</p>
          <p className="text-[11px] text-slate-600 leading-snug">
            Grammar and vocabulary pacing meet competitive standards.
          </p>
        </div>

        {/* Focus Next Subtest */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Focus next
            </span>
            <span className="text-xs font-bold text-amber-700">48%</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900">Focus next: Numerical Ability</p>
          <p className="text-[11px] text-slate-600 leading-snug">
            High-yield area to bridge the remaining 18% gap to passing.
          </p>
        </div>
      </div>

      {/* Recommended Next Action */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
            <BrainCircuit className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Recommended: Percentages — 10-minute drill</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-800 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md shrink-0">
            <Clock className="w-3 h-3 text-brand-600" />
            10 min
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
          Targeted drill to master percentage changes, fractions, and word problem equations without a calculator.
        </p>
      </div>

      {/* Primary Action & Secondary Preview Link */}
      <div className="pt-2 space-y-2.5 text-center">
        <Link
          href={diagnosticHref}
          prefetch={true}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm hover:bg-slate-800 transition transform active:scale-[0.98]"
        >
          <span>Start free diagnostic</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div>
          <Link
            href="/practice"
            prefetch={true}
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition"
          >
            Preview the practice interface
          </Link>
        </div>
      </div>
    </div>
  );
}
