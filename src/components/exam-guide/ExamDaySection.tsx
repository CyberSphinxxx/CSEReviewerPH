import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Shield,
} from "lucide-react";
import { EXAM_DAY_CHECKLIST } from "@/lib/exam-guide/csc-data";

export function ExamDaySection() {
  return (
    <section id="exam-day" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Examinee Compliance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exam-Day Protocol & What to Bring
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Sourced strictly from official CSC Examinee Advisories. Non-compliance results in disqualification.
        </p>
      </div>

      {/* Strict Gate Closure Warning */}
      <div className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/90 dark:bg-rose-950/40 p-4 sm:p-5 text-rose-950 dark:text-rose-100 flex items-start gap-3.5 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-sm text-rose-900 dark:text-rose-100">
            Strict Gate Closure at 7:45 AM Nationwide (Zero Exceptions)
          </p>
          <p className="text-xs leading-relaxed text-rose-900/90 dark:text-rose-200/90">
            School testing venue gates close promptly at 7:45 AM. Examinees arriving at 7:46 AM or later will be barred from taking the exam, with fees forfeited. Plan your commute to arrive at the testing center by 6:00 AM to 6:30 AM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. What to Bring */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mandatory Items to Bring</span>
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Allowed</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            {EXAM_DAY_CHECKLIST.bringItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Strictly Prohibited Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Strictly Prohibited Items</span>
            </h3>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">Confiscated</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            {EXAM_DAY_CHECKLIST.prohibitedItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Before Leaving Home Checklist */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Before Leaving Home Checklist</span>
            </h3>
            <span className="text-[11px] text-slate-400">Pre-Departure</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            {EXAM_DAY_CHECKLIST.beforeLeaving.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Inside the Examination Room */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Inside the Examination Room</span>
            </h3>
            <span className="text-[11px] text-slate-400">Venue Rules</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            {EXAM_DAY_CHECKLIST.venueProtocols.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
