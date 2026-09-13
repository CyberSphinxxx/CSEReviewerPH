import React from "react";
import {
  Calendar,
  ExternalLink,
} from "lucide-react";
import type { ExamSession } from "@/lib/exam-guide/types";
import { getOfficialSourceById } from "@/lib/exam-guide/finder-service";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface ExamScheduleSectionProps {
  sessions: ExamSession[];
  selectedSessionId: string;
  onSelectSession: (id: string) => void;
}

export function ExamScheduleSection({
  sessions,
  selectedSessionId,
  onSelectSession,
}: ExamScheduleSectionProps) {
  const upcomingSessions = sessions.filter((s) => !s.isHistorical);
  const historicalSessions = sessions.filter((s) => s.isHistorical);

  return (
    <section id="schedule" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>CSC Examination Calendar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CSE Exam Schedule & Application Periods
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Sourced from CSC Examination Announcement No. 05, s. 2026. Dates in Philippine Standard Time.
        </p>
      </div>

      {/* Calendar Notice */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/30 p-4 text-xs sm:text-sm text-blue-950 dark:text-blue-200 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The calendar announces nationwide examination dates but does not confirm individual testing center localities, filing procedures, or available slots. Always check the detailed examination announcement and your CSC Regional Office before applying.
        </p>
      </div>

      {/* Confirmed Upcoming Sessions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Confirmed 2027 Calendar (Pen and Paper Test)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {upcomingSessions.map((session) => {
            const isSelected = session.id === selectedSessionId;
            const primarySource = session.sourceIds[0] ? getOfficialSourceById(session.sourceIds[0]) : undefined;

            return (
              <div
                key={session.id}
                className={`rounded-2xl border p-5 sm:p-6 transition flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/30 shadow-md ring-2 ring-brand-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Upcoming Examination
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {session.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSession(session.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                        isSelected
                          ? "bg-brand-700 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Exam Date</span>
                      <span className="font-extrabold text-brand-700 dark:text-brand-300 text-sm">
                        {session.examDate}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Filing Opens</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {session.applicationOpenAt || "TBA"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Target Slots</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {session.targetExaminees ? `${session.targetExaminees.toLocaleString()} examinees` : "Nationwide"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Target Results</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {session.targetResultReleaseAt || "TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>Levels Tested:</strong> Professional and Subprofessional
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Application Rule:</strong> {session.applicationCloseRule}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {primarySource && (
                    <a
                      {...getSafeExternalLinkProps(primarySource.url)}
                      className="font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Announcement No. 05, s. 2026</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <span className="text-slate-400 text-[11px]">
                    Verified: {session.lastVerifiedAt}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Sessions Archive */}
      {historicalSessions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Historical Reference
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Past Examination Datasets
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historicalSessions.map((session) => {
              const isSelected = session.id === selectedSessionId;
              const primarySource = session.sourceIds[0] ? getOfficialSourceById(session.sourceIds[0]) : undefined;

              return (
                <div
                  key={session.id}
                  className={`rounded-2xl border p-5 sm:p-6 transition flex flex-col justify-between ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/10 dark:bg-brand-950/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Completed Exam
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Subject to amendments
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                          {session.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectSession(session.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          isSelected
                            ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "Active View" : "View Centers"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {session.historicalNote}
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                      <p>
                        <strong>Exam Date:</strong> {session.examDate}
                      </p>
                      <p>
                        <strong>Testing Centers:</strong> Sourced from Exam Announcement No. 03, s. 2026 and amended by Announcement No. 04, s. 2026.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    {primarySource && (
                      <a
                        {...getSafeExternalLinkProps(primarySource.url)}
                        className="font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                      >
                        <span className="truncate">{primarySource.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                    <span className="text-[11px] text-slate-400">Verified PST</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
