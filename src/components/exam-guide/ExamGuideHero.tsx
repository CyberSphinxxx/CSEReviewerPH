import React from "react";
import {
  Calendar,
  MapPin,
  FileCheck,
  Building2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CSE_REVIEWER_INDEPENDENCE_DISCLAIMER } from "@/lib/exam-guide/csc-domain";

export function ExamGuideHero() {
  return (
    <section className="space-y-6">
      {/* Official Independence Notice */}
      <div
        role="note"
        aria-label="Independent Platform Disclaimer"
        className="rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/90 dark:bg-amber-950/40 p-4 sm:p-5 shadow-xs text-xs sm:text-sm text-amber-950 dark:text-amber-200"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <span>Notice of Non-Affiliation & Editorial Independence</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-md">
                Official CSC Sources Only
              </span>
            </p>
            <p className="leading-relaxed text-amber-900/90 dark:text-amber-200/90">
              {CSE_REVIEWER_INDEPENDENCE_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Verified Civil Service Commission Reference Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            CSE Exam Guide and Official CSC Links
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Find examination schedules, possible testing centers by region, official CSC application instructions, school-assignment lookup guidance, and verified links to government portals.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
          <a
            href="#testing-centers"
            className="flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 transition group"
          >
            <MapPin className="w-5 h-5 mb-1.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition" />
            <span className="text-xs sm:text-sm font-bold leading-tight">Find Testing Centers</span>
          </a>

          <a
            href="#schedule"
            className="flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 transition group"
          >
            <Calendar className="w-5 h-5 mb-1.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition" />
            <span className="text-xs sm:text-sm font-bold leading-tight">Exam Schedule</span>
          </a>

          <a
            href="#how-to-apply"
            className="flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 transition group"
          >
            <FileCheck className="w-5 h-5 mb-1.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition" />
            <span className="text-xs sm:text-sm font-bold leading-tight">How to Apply</span>
          </a>

          <a
            href="#school-assignment"
            className="flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 transition group"
          >
            <Building2 className="w-5 h-5 mb-1.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition" />
            <span className="text-xs sm:text-sm font-bold leading-tight">School Assignment</span>
          </a>
        </div>

        {/* Freshness and Verification Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Verified Status:</strong> Examination Announcement No. 05, s. 2026 confirmed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Last verified: September 13, 2026, 10:00 AM PST</span>
            <a href="#sources" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              View Sources
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
