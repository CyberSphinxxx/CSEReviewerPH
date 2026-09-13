import React from "react";
import {
  FileCheck,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Globe,
  UserCheck,
} from "lucide-react";
import { APPLICATION_STEPS } from "@/lib/exam-guide/csc-data";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

export function ApplicationGuideSection() {
  return (
    <section id="how-to-apply" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Filing Procedures & Guidance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How to Apply for the CSE-PPT
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Filing procedures can differ by CSC region. Always follow your specific CSC Regional Office advisory.
        </p>
      </div>

      {/* Critical Application Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Slots May Close Early</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-900/90 dark:text-amber-200/90">
            Application slots are accepted on a first-come, first-served basis and often close before the published deadline once the regional quota is reached.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/30 p-4 text-xs text-blue-950 dark:text-blue-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-100">
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Personal Appearance Required</span>
          </div>
          <p className="leading-relaxed text-[11px] text-blue-900/90 dark:text-blue-200/90">
            An online registration or appointment does not complete the entire process online. You must appear in person for biometric capture and document check.
          </p>
        </div>

        <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-4 text-xs text-rose-950 dark:text-rose-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-100">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Anti-Fixer Warning</span>
          </div>
          <p className="leading-relaxed text-[11px] text-rose-900/90 dark:text-rose-200/90">
            Never pay any individual or third-party group to reserve, buy, or expedite an examination slot. Slots are non-transferable and CSC strictly prosecutes fixers.
          </p>
        </div>
      </div>

      {/* Step-by-Step Application Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Standard 12-Step Application Walkthrough
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPLICATION_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2 relative"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action button to open OCSEAS Region Selector */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
              <Globe className="w-4 h-4 text-brand-600" />
              <span>Ready to File? Start with the OCSEAS Region Selector</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The official universal portal on <code>ocseas.csc.gov.ph</code> guides you to your region&apos;s designated filing server.
            </p>
          </div>

          <a
            {...getSafeExternalLinkProps("https://ocseas.csc.gov.ph/home")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 transition shrink-0 shadow-xs"
          >
            <span>Open OCSEAS Selector</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
