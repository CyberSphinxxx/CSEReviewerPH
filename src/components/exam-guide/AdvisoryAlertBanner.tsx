import React from "react";
import { AlertCircle, AlertTriangle, Info, ExternalLink } from "lucide-react";
import type { OfficialAdvisory } from "@/lib/exam-guide/types";
import { getOfficialSourceById } from "@/lib/exam-guide/finder-service";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface AdvisoryAlertBannerProps {
  advisories: OfficialAdvisory[];
}

export function AdvisoryAlertBanner({ advisories }: AdvisoryAlertBannerProps) {
  if (!advisories || advisories.length === 0) return null;

  const hasUrgent = advisories.some((a) => a.priority === "urgent");

  return (
    <section
      aria-label={hasUrgent ? "Urgent CSC Advisories and Bulletins" : "Official CSC Advisories and Bulletins"}
      className="space-y-3"
    >
      {advisories.map((advisory) => {
        const isUrgent = advisory.priority === "urgent";
        const isImportant = advisory.priority === "important";
        const source = getOfficialSourceById(advisory.sourceId);

        const containerClasses = isUrgent
          ? "border-rose-400 dark:border-rose-800 bg-rose-50/95 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100"
          : isImportant
          ? "border-amber-300 dark:border-amber-800 bg-amber-50/95 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100"
          : "border-sky-300 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100";

        const badgeClasses = isUrgent
          ? "bg-rose-200/90 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700"
          : isImportant
          ? "bg-amber-200/90 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700"
          : "bg-sky-200/90 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700";

        const Icon = isUrgent ? AlertCircle : isImportant ? AlertTriangle : Info;

        return (
          <div
            key={advisory.id}
            role="alert"
            className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition ${containerClasses}`}
          >
            <div className="flex items-start gap-3.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isUrgent ? "text-rose-600 dark:text-rose-400" : isImportant ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"}`} />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${badgeClasses}`}>
                    {advisory.priority === "urgent" ? "Urgent Advisory" : advisory.priority === "important" ? "Official Amendment" : "Official Notice"}
                  </span>
                  {advisory.publishedAt && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Published: {advisory.publishedAt}
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {advisory.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {advisory.summary}
                </p>

                {source && (
                  <div className="pt-1.5 flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Official Source:</span>
                    <a
                      {...getSafeExternalLinkProps(source.url)}
                      className="font-medium text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1 truncate max-w-md"
                    >
                      <span className="truncate">{source.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
