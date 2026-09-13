/**
 * Type definitions for the CSE Exam Guide and Official CSC Resources feature.
 * All models represent official Civil Service Commission (CSC) logistical,
 * regulatory, schedule, venue, and portal data.
 */

export type CscOfficialDomain =
  | "csc.gov.ph"
  | "www.csc.gov.ph"
  | "ocseas.csc.gov.ph"
  | "services.csc.gov.ph"
  | "erpo.csc.gov.ph"
  | "exam.csc.gov.ph";

export interface OfficialSource {
  id: string;
  publisher: "Civil Service Commission";
  title: string;
  url: string;
  sourceType:
    | "web-page"
    | "exam-announcement"
    | "amendment"
    | "regional-advisory"
    | "application-portal"
    | "assignment-system"
    | "result-advisory"
    | "job-portal";
  publishedAt?: string; // YYYY-MM-DD or ISO string
  retrievedAt: string; // ISO string with PST reference
  officialDomain: boolean;
  supersedesSourceId?: string;
  supersededBySourceId?: string;
  notes?: string;
}

export type ExamLevel = "professional" | "subprofessional";

export type ExamSessionStatus =
  | "upcoming"
  | "announced"
  | "applications-not-open"
  | "applications-open"
  | "slots-limited"
  | "applications-closed"
  | "assignments-available"
  | "completed"
  | "results-available"
  | "postponed"
  | "partially-suspended"
  | "suspended"
  | "cancelled"
  | "rescheduled";

export interface ExamSession {
  id: string;
  examId: string;
  title: string;
  levels: ExamLevel[];
  examDate: string; // e.g., "14 March 2027" or ISO
  applicationOpenAt?: string;
  applicationCloseAt?: string;
  applicationCloseRule?: string;
  targetExaminees?: number;
  targetResultReleaseAt?: string;
  status: ExamSessionStatus;
  isHistorical?: boolean;
  historicalNote?: string;
  notes?: string;
  sourceIds: string[];
  lastVerifiedAt: string; // PST timestamp
}

export type TestingCenterStatus =
  | "announced"
  | "added"
  | "changed"
  | "removed"
  | "suspended"
  | "completed";

export interface TestingCenter {
  id: string;
  examSessionId: string;
  regionCode: string;
  province?: string;
  locality: string;
  levels: ExamLevel[];
  status: TestingCenterStatus;
  replacesTestingCenterId?: string;
  previousLocality?: string;
  changeNote?: string;
  sourceIds: string[];
  lastVerifiedAt: string;
}

export interface ExamVenueAssignmentNotice {
  id: string;
  examSessionId: string;
  regionCode?: string;
  systemUrl: string;
  availableFrom?: string;
  sourceId: string;
  lastVerifiedAt: string;
}

export interface CscRegionalOffice {
  code: string;
  name: string;
  shortName: string;
  officialPageUrl: string;
  contactPageUrl?: string;
  applicationPortal?: {
    type: "ocseas" | "eserve" | "regional-system" | "in-person" | "unknown";
    name: string;
    url?: string;
    sourceId: string;
    appliesToExamSessionId?: string;
    warning?: string;
  };
  contactDetails?: {
    address?: string;
    telephone?: string[];
    email?: string[];
  };
  lastVerifiedAt: string;
}

export type RequirementCategory =
  | "eligibility"
  | "application-form"
  | "identification"
  | "photograph"
  | "fee"
  | "appointment"
  | "personal-appearance"
  | "other";

export interface ExamRequirement {
  id: string;
  examSessionId: string;
  category: RequirementCategory;
  title: string;
  description: string;
  required: boolean;
  sourceId: string;
  lastVerifiedAt: string;
}

export type AdvisoryType =
  | "general"
  | "application"
  | "testing-center-amendment"
  | "school-assignment"
  | "exam-day"
  | "weather"
  | "partial-suspension"
  | "suspension"
  | "cancellation"
  | "rescheduling"
  | "results"
  | "correction";

export interface OfficialAdvisory {
  id: string;
  examSessionId?: string;
  type: AdvisoryType;
  title: string;
  summary: string;
  affectedRegionCodes: string[];
  affectedTestingCenterIds: string[];
  effectiveAt?: string;
  publishedAt?: string;
  sourceId: string;
  priority: "normal" | "important" | "urgent";
  active: boolean;
}

export interface OfficialLinkItem {
  id: string;
  label: string;
  category: "general" | "application" | "assignment" | "careers";
  url: string;
  domainBadge: string;
  description: string;
  regionScope?: string; // e.g. "Region I only"
  warning?: string;
  sourceId?: string;
  isLogin?: boolean;
}
