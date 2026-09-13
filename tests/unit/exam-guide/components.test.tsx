import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExamGuideHero } from "@/components/exam-guide/ExamGuideHero";
import { AdvisoryAlertBanner } from "@/components/exam-guide/AdvisoryAlertBanner";
import { ExamScheduleSection } from "@/components/exam-guide/ExamScheduleSection";
import { TestingCenterFinder } from "@/components/exam-guide/TestingCenterFinder";
import { OfficialLinksDirectory } from "@/components/exam-guide/OfficialLinksDirectory";
import { SchoolAssignmentSection } from "@/components/exam-guide/SchoolAssignmentSection";
import {
  getAllExamSessions,
  getAllRegionalOffices,
  getOfficialAdvisories,
  getOfficialLinks,
} from "@/lib/exam-guide";

describe("Exam Guide UI Components", () => {
  it("renders ExamGuideHero with prominent independence disclaimer and action links", () => {
    render(<ExamGuideHero />);

    // Title and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/CSE Exam Guide and Official CSC Links/i);
    expect(screen.getByText(/Find examination schedules, possible testing centers/i)).toBeInTheDocument();

    // Mandatory independence disclaimer
    const disclaimer = screen.getByRole("note", { name: /Independent Platform Disclaimer/i });
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveTextContent(/not affiliated with or endorsed by the Civil Service Commission/i);

    // Quick anchor jump links
    expect(screen.getByText("Find Testing Centers")).toBeInTheDocument();
    expect(screen.getByText("Exam Schedule")).toBeInTheDocument();
    expect(screen.getByText("How to Apply")).toBeInTheDocument();
    expect(screen.getByText("School Assignment")).toBeInTheDocument();
  });

  it("renders AdvisoryAlertBanner with alert semantics and urgent priority styling", () => {
    const advisories = getOfficialAdvisories();
    render(<AdvisoryAlertBanner advisories={advisories} />);

    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);

    // Check presence of urgent weather suspension for NCR
    expect(screen.getByText(/Urgent: Weather Suspension for 9 August 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/URGENT ADVISORY/i)).toBeInTheDocument();
  });

  it("renders ExamScheduleSection with 2027 confirmed dates and historical indicator", () => {
    const sessions = getAllExamSessions();
    const handleSelect = vi.fn();

    render(
      <ExamScheduleSection
        sessions={sessions}
        selectedSessionId="session-2027-03-14"
        onSelectSession={handleSelect}
      />
    );

    // Heading
    expect(screen.getByRole("heading", { name: /CSE Exam Schedule & Application Periods/i })).toBeInTheDocument();

    // Upcoming sessions
    expect(screen.getByText("14 March 2027 CSE-PPT")).toBeInTheDocument();
    expect(screen.getByText("8 August 2027 CSE-PPT")).toBeInTheDocument();

    // Target examinees
    expect(screen.getAllByText(/350,000 examinees/i).length).toBeGreaterThanOrEqual(1);

    // Historical session
    expect(screen.getByText("9 August 2026 CSE-PPT")).toBeInTheDocument();
    expect(screen.getByText(/Historical record/i)).toBeInTheDocument();
  });

  it("renders TestingCenterFinder with clear terminology definitions and interactive filters", () => {
    const sessions = getAllExamSessions();
    const regionalOffices = getAllRegionalOffices();
    const handleSelect = vi.fn();

    render(
      <TestingCenterFinder
        sessions={sessions}
        regionalOffices={regionalOffices}
        selectedSessionId="session-2026-08-09"
        onSelectSession={handleSelect}
      />
    );

    // Terminology box terms
    expect(screen.getByText(/1\. Testing Center/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Application Office/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. School Assignment/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Room Assignment/i)).toBeInTheDocument();

    // Form inputs
    const sessionSelect = screen.getByLabelText(/Examination Session/i);
    const regionSelect = screen.getByLabelText(/CSC Region/i);
    const searchInput = screen.getByLabelText(/Locality \/ Province Search/i);

    expect(sessionSelect).toBeInTheDocument();
    expect(regionSelect).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();

    // Filter by Region VIII to check Calbayog transfer and Catbalogan superseded note
    fireEvent.change(regionSelect, { target: { value: "region-8" } });

    expect(screen.getByText("Calbayog City")).toBeInTheDocument();
    expect(screen.getByText("Catbalogan City")).toBeInTheDocument();
    expect(screen.getByText(/Transferred from Catbalogan City/i)).toBeInTheDocument();
  });

  it("displays notice when testing centers are pending for 2027 sessions", () => {
    const sessions = getAllExamSessions();
    const regionalOffices = getAllRegionalOffices();
    const handleSelect = vi.fn();

    render(
      <TestingCenterFinder
        sessions={sessions}
        regionalOffices={regionalOffices}
        selectedSessionId="session-2027-03-14"
        onSelectSession={handleSelect}
      />
    );

    expect(screen.getByText(/Testing Centers Not Yet Published for 14 March 2027 CSE-PPT/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse 9 August 2026 Historical Testing Centers/i)).toBeInTheDocument();
  });

  it("renders OfficialLinksDirectory with domain badges, scoped login warning, and no open redirects", () => {
    const links = getOfficialLinks();
    render(<OfficialLinksDirectory links={links} />);

    expect(screen.getByText(/Official CSC Links Directory/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your CSC credentials only on a verified csc.gov.ph domain/i)).toBeInTheDocument();

    // Check Region I login is scoped
    expect(screen.getByText(/Region I Only/i)).toBeInTheDocument();
    expect(screen.getByText(/Region I OCSEAS Applicant Login/i)).toBeInTheDocument();
  });

  it("ensures SchoolAssignmentSection never renders personal credential/data input fields", () => {
    const { container } = render(<SchoolAssignmentSection />);

    // Must NOT contain input fields for password, birthdate, or examinee ID
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBe(0);

    // Direct link to eNOSA
    const enosaLink = screen.getByRole("link", { name: /Open CSC eNOSA Portal/i });
    expect(enosaLink).toHaveAttribute("href", "https://erpo.csc.gov.ph/eNOSAv3/");
    expect(enosaLink).toHaveAttribute("target", "_blank");
    expect(enosaLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
