/**
 * Query and filter service for the CSE Exam Guide and Testing Center Finder.
 */

import {
  EXAM_SESSIONS,
  HISTORICAL_TESTING_CENTERS_AUG_2026,
  CSC_REGIONAL_OFFICES,
  OFFICIAL_ADVISORIES,
  OFFICIAL_SOURCES,
  OFFICIAL_LINKS_DIRECTORY,
  EXAM_REQUIREMENTS_DATA,
} from "./csc-data";
import type {
  ExamSession,
  TestingCenter,
  CscRegionalOffice,
  OfficialAdvisory,
  OfficialSource,
  OfficialLinkItem,
  ExamRequirement,
  ExamLevel,
} from "./types";

export interface TestingCenterFilterParams {
  examSessionId: string;
  regionCode?: string;
  query?: string;
  level?: ExamLevel;
  includeSuperseded?: boolean;
}

export function getAllExamSessions(): ExamSession[] {
  return EXAM_SESSIONS;
}

export function getExamSessionById(id: string): ExamSession | undefined {
  return EXAM_SESSIONS.find((s) => s.id === id);
}

export function getAllRegionalOffices(): CscRegionalOffice[] {
  return CSC_REGIONAL_OFFICES;
}

export function getRegionalOfficeByCode(code: string): CscRegionalOffice | undefined {
  return CSC_REGIONAL_OFFICES.find((ro) => ro.code.toLowerCase() === code.toLowerCase());
}

export function getTestingCentersByFilter(params: TestingCenterFilterParams): {
  centers: TestingCenter[];
  totalAnnounced: number;
  hasAmendments: boolean;
} {
  const { examSessionId, regionCode, query, level, includeSuperseded = true } = params;

  // Currently only 9 August 2026 has confirmed testing centers populated
  let centers =
    examSessionId === "session-2026-08-09"
      ? [...HISTORICAL_TESTING_CENTERS_AUG_2026]
      : [];

  if (regionCode && regionCode !== "all") {
    centers = centers.filter((c) => c.regionCode.toLowerCase() === regionCode.toLowerCase());
  }

  if (level) {
    centers = centers.filter((c) => c.levels.includes(level));
  }

  if (query && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    centers = centers.filter(
      (c) =>
        c.locality.toLowerCase().includes(q) ||
        (c.province && c.province.toLowerCase().includes(q)) ||
        (c.previousLocality && c.previousLocality.toLowerCase().includes(q))
    );
  }

  if (!includeSuperseded) {
    // Exclude centers that were removed or superseded
    centers = centers.filter((c) => c.status !== "removed" && !c.changeNote?.includes("Superseded"));
  }

  const hasAmendments = centers.some(
    (c) => c.status === "added" || c.status === "changed" || c.status === "removed" || c.status === "suspended"
  );

  return {
    centers,
    totalAnnounced: centers.length,
    hasAmendments,
  };
}

export function getOfficialAdvisories(params?: {
  examSessionId?: string;
  regionCode?: string;
  activeOnly?: boolean;
}): OfficialAdvisory[] {
  let list = [...OFFICIAL_ADVISORIES];

  if (params?.activeOnly) {
    list = list.filter((a) => a.active);
  }

  if (params?.examSessionId) {
    list = list.filter((a) => !a.examSessionId || a.examSessionId === params.examSessionId);
  }

  if (params?.regionCode && params.regionCode !== "all") {
    list = list.filter(
      (a) => a.affectedRegionCodes.length === 0 || a.affectedRegionCodes.includes(params.regionCode!)
    );
  }

  // Sort by priority (urgent > important > normal)
  const priorityWeight: Record<OfficialAdvisory["priority"], number> = {
    urgent: 3,
    important: 2,
    normal: 1,
  };

  return list.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}

export function getOfficialLinks(): OfficialLinkItem[] {
  return OFFICIAL_LINKS_DIRECTORY;
}

export function getAllOfficialSources(): OfficialSource[] {
  return OFFICIAL_SOURCES;
}

export function getOfficialSourceById(id: string): OfficialSource | undefined {
  return OFFICIAL_SOURCES.find((s) => s.id === id);
}

export function getRequirementsForSession(examSessionId: string): ExamRequirement[] {
  const match = EXAM_REQUIREMENTS_DATA.filter((r) => r.examSessionId === examSessionId);
  if (match.length > 0) return match;
  // Fallback to default active requirements
  return EXAM_REQUIREMENTS_DATA;
}
