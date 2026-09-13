"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export interface HeroDiagnosticPlanPreviewProps {
  level?: "professional" | "subprofessional";
  audience?: "first-time" | "retaker" | "working";
}

const AUDIENCE_OUTCOMES = {
  "first-time": {
    readiness: 62,
    weakSubtest: "Numerical Ability",
    weakStatus: "Needs focus",
    weakBlocks: 6,
    strongSubtest: "Verbal Ability",
    strongStatus: "Strong",
    strongBlocks: 8,
    drillTitle: "Percentages & Interest",
    drillTime: "10-minute focused practice",
  },
  retaker: {
    readiness: 74,
    weakSubtest: "Analytical Ability",
    weakStatus: "Needs focus",
    weakBlocks: 6,
    strongSubtest: "General Information",
    strongStatus: "Strong",
    strongBlocks: 9,
    drillTitle: "Word Analogy & Logic",
    drillTime: "10-minute focused practice",
  },
  working: {
    readiness: 68,
    weakSubtest: "Numerical Ability",
    weakStatus: "Needs focus",
    weakBlocks: 6,
    strongSubtest: "Verbal Ability",
    strongStatus: "Strong",
    strongBlocks: 8,
    drillTitle: "Fractions & Ratios",
    drillTime: "10-minute focused practice",
  },
};

export function HeroDiagnosticPlanPreview({
  audience = "first-time",
}: HeroDiagnosticPlanPreviewProps) {
  const outcome = AUDIENCE_OUTCOMES[audience] || AUDIENCE_OUTCOMES["first-time"];

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Subtle gold assessment-file accent backdrop */}
      <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-200/40 to-brand-500/15 blur-xs -z-10" />

      {/* Main Diagnostic Card with light report-style left border */}
      <div className="relative rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 text-slate-800 space-y-4">
        {/* Header Row: Outcome Preview Label & Title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Example Diagnostic Outcome
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-1.5">
              YOUR DIAGNOSTIC PLAN
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
            Report
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
              {outcome.readiness}%
            </span>
            <span className="text-xs text-slate-500">diagnostic baseline</span>
          </div>

          {/* 10-block progress bar representing readiness */}
          <div
            className="flex items-center gap-1 w-full pt-1"
            role="progressbar"
            aria-valuenow={outcome.readiness}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Estimated readiness: ${outcome.readiness}%`}
          >
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full ${
                  idx < Math.round(outcome.readiness / 10)
                    ? "bg-slate-900"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtest Breakdown Meters (Report Style) */}
        <div className="space-y-2.5 pt-1">
          {/* Identified Weak Area / Focus Subtest */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {outcome.weakSubtest}
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                {outcome.weakStatus}
              </span>
            </div>
            <div className="flex items-center gap-1 w-full" aria-label={`${outcome.weakSubtest}: ${outcome.weakStatus}`}>
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full ${
                    idx < outcome.weakBlocks ? "bg-amber-500" : "bg-amber-200/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Identified Strong Area */}
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {outcome.strongSubtest}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                {outcome.strongStatus}
              </span>
            </div>
            <div className="flex items-center gap-1 w-full" aria-label={`${outcome.strongSubtest}: ${outcome.strongStatus}`}>
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full ${
                    idx < outcome.strongBlocks ? "bg-emerald-600" : "bg-emerald-200/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Non-Interactive Outcome Summary: "AFTER YOUR DIAGNOSTIC" */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              AFTER YOUR DIAGNOSTIC
            </p>
            <span className="text-[10px] font-semibold text-slate-500">
              Step 2 of study loop
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Your next recommended drill</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {outcome.drillTitle}
              </p>
              <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                {outcome.drillTime}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Tertiary Link (Visually Quiet, No Duplicate Button) */}
        <div className="pt-1 text-center">
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600"
          >
            <span>Preview the practice interface</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
