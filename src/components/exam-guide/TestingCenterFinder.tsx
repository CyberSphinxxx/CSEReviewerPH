"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Filter,
  Info,
  Building,
  ExternalLink,
  HelpCircle,
  Clock,
  History,
  Calendar,
} from "lucide-react";
import type {
  ExamSession,
  CscRegionalOffice,
  ExamLevel,
} from "@/lib/exam-guide/types";
import {
  getTestingCentersByFilter,
  getRegionalOfficeByCode,
} from "@/lib/exam-guide/finder-service";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface TestingCenterFinderProps {
  sessions: ExamSession[];
  regionalOffices: CscRegionalOffice[];
  selectedSessionId: string;
  onSelectSession: (id: string) => void;
}

export function TestingCenterFinder({
  sessions,
  regionalOffices,
  selectedSessionId,
  onSelectSession,
}: TestingCenterFinderProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<ExamLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTerminology, setShowTerminology] = useState<boolean>(true);

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  // Perform search / filtering
  const { centers } = useMemo(() => {
    return getTestingCentersByFilter({
      examSessionId: selectedSessionId,
      regionCode: selectedRegion === "all" ? undefined : selectedRegion,
      query: searchQuery,
      level: selectedLevel === "all" ? undefined : selectedLevel,
      includeSuperseded: true,
    });
  }, [selectedSessionId, selectedRegion, searchQuery, selectedLevel]);

  const selectedOffice = selectedRegion !== "all" ? getRegionalOfficeByCode(selectedRegion) : undefined;

  return (
    <section id="testing-centers" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Interactive Venue Locator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Testing-Center Finder
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Filter by examination date, CSC region, and municipality to view announced exam centers.
        </p>
      </div>

      {/* Mandatory Terminology Clarification Box */}
      {showTerminology && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/30 p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Important: Civil Service Examination Venue Terminology</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTerminology(false)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              aria-label="Hide terminology definitions"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed">
            The Civil Service Commission distinguishes between examination localities and assigned rooms. Never treat these four concepts as interchangeable:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 block">
                1. Testing Center
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                The city, municipality, or locality designated by the CSC for conducting the examination.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 block">
                2. Application Office
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                The CSC Regional or Field Office where applications or appointments are processed.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 block">
                3. School Assignment
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                The specific school campus or testing venue assigned to an accepted applicant.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 block">
                4. Room Assignment
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                The specific classroom, seat number, and batch room within the testing venue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Exam Date Selector (Required) */}
          <div className="space-y-1.5">
            <label
              htmlFor="exam-session-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Examination Session *</span>
            </label>
            <select
              id="exam-session-select"
              value={selectedSessionId}
              onChange={(e) => onSelectSession(e.target.value)}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} {session.isHistorical ? "(Historical)" : "(Upcoming)"}
                </option>
              ))}
            </select>
          </div>

          {/* 2. CSC Region Selector (Required) */}
          <div className="space-y-1.5">
            <label
              htmlFor="csc-region-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Building className="w-3.5 h-3.5 text-brand-600" />
              <span>CSC Region *</span>
            </label>
            <select
              id="csc-region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="all">All CSC Regions (Nationwide)</option>
              {regionalOffices.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Search Query Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="locality-search-input"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-brand-600" />
              <span>Locality / Province Search</span>
            </label>
            <input
              id="locality-search-input"
              type="text"
              placeholder="e.g. San Fernando, Cebu, Masbate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* 4. Level Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="exam-level-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-brand-600" />
              <span>Examination Level</span>
            </label>
            <select
              id="exam-level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as ExamLevel | "all")}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="all">Both Professional & Subprofessional</option>
              <option value="professional">Professional Level Only</option>
              <option value="subprofessional">Subprofessional Level Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span>
              Session: <strong className="text-slate-900 dark:text-white">{currentSession.title}</strong>
            </span>
            <span>•</span>
            <span>
              Region:{" "}
              <strong className="text-slate-900 dark:text-white">
                {selectedOffice ? selectedOffice.name : "All Regions"}
              </strong>
            </span>
            {currentSession.isHistorical && (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">
                Historical Dataset
              </span>
            )}
          </div>

          {selectedOffice && (
            <a
              {...getSafeExternalLinkProps(selectedOffice.officialPageUrl)}
              className="inline-flex items-center gap-1 text-brand-700 dark:text-brand-300 font-semibold hover:underline"
            >
              <span>Visit Official {selectedOffice.shortName} Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Results Rendering */}
      {currentSession.id !== "session-2026-08-09" ? (
        /* Upcoming Session: Testing Centers Not Yet Announced Notice */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Testing Centers Not Yet Published for {currentSession.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Examination Announcement No. 05, s. 2026 establishes the calendar date ({currentSession.examDate}), but official testing center localities are identified in an upcoming exam-specific announcement prior to the <strong>{currentSession.applicationOpenAt}</strong> filing opening.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onSelectSession("session-2026-08-09")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 transition shadow-xs"
            >
              <History className="w-4 h-4" />
              <span>Browse 9 August 2026 Historical Testing Centers</span>
            </button>
          </div>
        </div>
      ) : (
        /* Historical Session Results */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong>{centers.length}</strong> announced testing centers across selected filters.
            </p>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Amended / Transferred
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Removed / Suspended
              </span>
            </div>
          </div>

          {centers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-slate-500">
              No testing centers matched your search query. Try broadening your region or search keywords.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {centers.map((center) => {
                const office = getRegionalOfficeByCode(center.regionCode);
                const isAdded = center.status === "added";
                const isChanged = center.status === "changed";
                const isRemoved = center.status === "removed";
                const isSuspended = center.status === "suspended";

                return (
                  <div
                    key={center.id}
                    className={`rounded-2xl border p-4 transition flex flex-col justify-between space-y-3 ${
                      isRemoved
                        ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 opacity-80"
                        : isSuspended
                        ? "border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900"
                        : isAdded || isChanged
                        ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                          {office?.shortName || center.regionCode}
                        </span>

                        {isAdded && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            Added by Amendment
                          </span>
                        )}
                        {isChanged && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                            Transferred Location
                          </span>
                        )}
                        {isRemoved && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            Removed
                          </span>
                        )}
                        {isSuspended && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            Suspended (Weather)
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-base font-extrabold text-slate-900 dark:text-white ${
                          isRemoved ? "line-through text-slate-500 dark:text-slate-400" : ""
                        }`}
                      >
                        {center.locality}
                      </h4>

                      {center.province && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Province: {center.province}
                        </p>
                      )}

                      {/* Amendment change history callout */}
                      {center.changeNote && (
                        <div className="p-2 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 leading-snug">
                          <strong>Amendment Note:</strong> {center.changeNote}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Levels: Pro & SubPro</span>
                      {office && (
                        <a
                          {...getSafeExternalLinkProps(office.officialPageUrl)}
                          className="font-medium text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>{office.shortName} Advisory</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Localized assignment reminder banner */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Locality vs. Exact Venue:</strong> This list identifies announced testing-center localities (cities or municipalities). Your exact assigned school, building, and room are released separately by the CSC 1 to 2 weeks before exam day via the{" "}
              <a href="#school-assignment" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                Online Notice of School Assignment (eNOSA)
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
