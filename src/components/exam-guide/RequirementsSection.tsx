import React from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import type { ExamRequirement } from "@/lib/exam-guide/types";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface RequirementsSectionProps {
  requirements: ExamRequirement[];
}

export function RequirementsSection({ requirements }: RequirementsSectionProps) {
  const eligibility = requirements.filter((r) => r.category === "eligibility");
  const documents = requirements.filter((r) => r.category !== "eligibility");

  return (
    <section id="requirements" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Documentary Checklist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application & Documentary Requirements
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Sourced from signed CSC Examination Announcements. Strict compliance is required at filing.
        </p>
      </div>

      {/* Freshness Notice */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Requirements can change per examination series. Read the complete official examination announcement before submitting an application. Do not submit old photos or non-compliant ID cards as they will be rejected at the counter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Documentary Requirements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Required Documents to Submit</span>
            </h3>
            <span className="text-[11px] text-slate-400">At Personal Appearance</span>
          </div>

          <div className="space-y-3.5">
            {documents.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {req.title}
                  </h4>
                  {req.required && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full shrink-0">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {req.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Qualifications & Eligibility */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Applicant Eligibility Criteria</span>
            </h3>
            <span className="text-[11px] text-slate-400">Statutory Rules</span>
          </div>

          <div className="space-y-3.5">
            {eligibility.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {req.title}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full shrink-0">
                    Statutory
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {req.description}
                </p>
              </div>
            ))}
          </div>

          {/* Download CS Form No. 100 Callout */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <a
              {...getSafeExternalLinkProps("https://www.csc.gov.ph/downloads/memorandum-circulars/category/560-exam-announcement-2026")}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Download Official CSC Application Form & Advisories</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
