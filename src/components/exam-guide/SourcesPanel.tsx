"use client";

import React, { useState } from "react";
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import type { OfficialSource } from "@/lib/exam-guide/types";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface SourcesPanelProps {
  sources: OfficialSource[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="sources" className="space-y-4 scroll-mt-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Sources & Editorial Audit Trail ({sources.length} Documents Cited)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All dates, venues, schedules, and links are verified strictly against official CSC releases.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            aria-expanded={isExpanded}
            aria-controls="official-sources-list"
          >
            <span>{isExpanded ? "Collapse Sources" : "View Sourced Documents"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div id="official-sources-list" className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        csc.gov.ph
                      </span>
                      {source.publishedAt && (
                        <span className="text-[11px] text-slate-400">
                          Published: {source.publishedAt}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                      {source.title}
                    </h4>

                    {source.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {source.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <a
                      {...getSafeExternalLinkProps(source.url)}
                      className="font-bold text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-slate-400 text-[10px]">
                      Verified PST: {source.retrievedAt.split("T")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Policy on Outdated Info */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-3">
              <span>
                <strong>Editorial Notice:</strong> New advisories, weather suspensions, or testing-center amendments are added following verification against signed CSC releases.
              </span>
              <a
                href="/contact"
                className="font-bold text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <Flag className="w-3 h-3" />
                <span>Report Outdated Info</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
