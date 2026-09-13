"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  FileCheck,
  Building2,
  Clock,
  Award,
  Globe,
  ExternalLink,
  ChevronRight,
  Building,
} from "lucide-react";
import {
  getAllExamSessions,
  getAllRegionalOffices,
  getOfficialAdvisories,
  getOfficialLinks,
  getAllOfficialSources,
  getRequirementsForSession,
} from "@/lib/exam-guide/finder-service";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";
import { ExamGuideHero } from "./ExamGuideHero";
import { AdvisoryAlertBanner } from "./AdvisoryAlertBanner";
import { ExamScheduleSection } from "./ExamScheduleSection";
import { TestingCenterFinder } from "./TestingCenterFinder";
import { ApplicationGuideSection } from "./ApplicationGuideSection";
import { RequirementsSection } from "./RequirementsSection";
import { SchoolAssignmentSection } from "./SchoolAssignmentSection";
import { ExamDaySection } from "./ExamDaySection";
import { ResultsSection } from "./ResultsSection";
import { OfficialLinksDirectory } from "./OfficialLinksDirectory";
import { RegionalOfficeDirectory } from "./RegionalOfficeDirectory";
import { SourcesPanel } from "./SourcesPanel";

interface ExamGuideViewProps {
  initialSessionId?: string;
  initialSection?: string;
}

export function ExamGuideView({
  initialSessionId = "session-2027-03-14",
  initialSection,
}: ExamGuideViewProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(initialSessionId);

  React.useEffect(() => {
    if (initialSection) {
      const element = document.getElementById(initialSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [initialSection]);

  const sessions = getAllExamSessions();
  const regionalOffices = getAllRegionalOffices();
  const advisories = getOfficialAdvisories();
  const officialLinks = getOfficialLinks();
  const sources = getAllOfficialSources();
  const requirements = getRequirementsForSession(selectedSessionId);

  // Filter urgent advisories for prominent placement
  const urgentAdvisories = advisories.filter((a) => a.priority === "urgent");
  const otherAdvisories = advisories.filter((a) => a.priority !== "urgent");

  return (
    <div className="space-y-10">
      {/* 1. Urgent Advisories at the very top */}
      {urgentAdvisories.length > 0 && (
        <AdvisoryAlertBanner advisories={urgentAdvisories} />
      )}

      {/* 2. Hero Section with Independence Notice */}
      <ExamGuideHero />

      {/* 3. Main Desktop Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Important & Normal Advisories if any */}
          {otherAdvisories.length > 0 && (
            <AdvisoryAlertBanner advisories={otherAdvisories} />
          )}

          {/* Section: Exam Schedule */}
          <ExamScheduleSection
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
          />

          {/* Section: Testing Center Finder */}
          <TestingCenterFinder
            sessions={sessions}
            regionalOffices={regionalOffices}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
          />

          {/* Section: How to Apply */}
          <ApplicationGuideSection />

          {/* Section: Requirements */}
          <RequirementsSection requirements={requirements} />

          {/* Section: School Assignment (eNOSA) */}
          <SchoolAssignmentSection />

          {/* Section: Exam Day Protocols */}
          <ExamDaySection />

          {/* Section: Results & Certification */}
          <ResultsSection />

          {/* Section: Official Regional Offices Directory */}
          <RegionalOfficeDirectory offices={regionalOffices} />

          {/* Section: Official Links Directory */}
          <OfficialLinksDirectory links={officialLinks} />

          {/* Section: Sources & Audit Trail */}
          <SourcesPanel sources={sources} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Quick Page Jump Table of Contents */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Guide Navigation
            </h3>
            <nav className="space-y-1 text-xs">
              <a
                href="#schedule"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  <span>Exam Schedule (2027 / 2026)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#testing-centers"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>Testing-Center Finder</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#how-to-apply"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>How to Apply (12 Steps)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#requirements"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Documentary Requirements</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#school-assignment"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-brand-600" />
                  <span>School Assignment (eNOSA)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#exam-day"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Exam Day Protocols</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#results"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  <span>Results & Ratings</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#regional-offices"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-brand-600" />
                  <span>16 Regional Offices</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="#official-links"
                className="flex items-center justify-between p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-brand-600" />
                  <span>Official CSC Links</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </nav>
          </div>

          {/* Quick Application Portals Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Key CSC Portals
            </h3>

            <div className="space-y-2 text-xs">
              <a
                {...getSafeExternalLinkProps("https://ocseas.csc.gov.ph/home")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 flex items-center justify-between transition group"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block group-hover:text-brand-700 transition">
                    CSC OCSEAS Region Selector
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">ocseas.csc.gov.ph</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
              </a>

              <a
                {...getSafeExternalLinkProps("https://erpo.csc.gov.ph/eNOSAv3/")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 flex items-center justify-between transition group"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block group-hover:text-brand-700 transition">
                    Notice of School Assignment
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">erpo.csc.gov.ph</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
              </a>

              <a
                {...getSafeExternalLinkProps("https://www.csc.gov.ph/career/")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 flex items-center justify-between transition group"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block group-hover:text-brand-700 transition">
                    CSC Job Opportunities Portal
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">csc.gov.ph/career</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
              </a>
            </div>
          </div>

          {/* Diagnostic Mock Test Callout */}
          <div className="bg-gradient-to-br from-brand-800 to-brand-950 rounded-2xl p-5 text-white space-y-3 shadow-md">
            <h3 className="text-sm font-bold">
              Preparing for the 14 March 2027 CSE-PPT?
            </h3>
            <p className="text-xs text-brand-100/90 leading-relaxed">
              Take a free 10-question diagnostic exam to evaluate your readiness across Verbal, Numerical, and Analytical subjects.
            </p>
            <Link
              href="/exams/professional/quick"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-extrabold text-xs hover:bg-gold-400 transition"
            >
              Start Free 10-Question Diagnostic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
