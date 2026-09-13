import { describe, it, expect } from "vitest";
import {
  getAllExamSessions,
  getExamSessionById,
  getTestingCentersByFilter,
  getOfficialAdvisories,
  getAllRegionalOffices,
  getRegionalOfficeByCode,
  getOfficialLinks,
  getAllOfficialSources,
  getOfficialSourceById,
  isOfficialCscUrl,
} from "@/lib/exam-guide";

describe("CSE Exam Guide Finder Service & Data Consistency", () => {
  it("returns all confirmed and historical exam sessions", () => {
    const sessions = getAllExamSessions();
    expect(sessions.length).toBeGreaterThanOrEqual(3);

    const march2027 = getExamSessionById("session-2027-03-14");
    expect(march2027).toBeDefined();
    expect(march2027?.examDate).toBe("14 March 2027");
    expect(march2027?.applicationOpenAt).toBe("2 November 2026");
    expect(march2027?.targetExaminees).toBe(350000);
    expect(march2027?.isHistorical).toBe(false);

    const august2027 = getExamSessionById("session-2027-08-08");
    expect(august2027).toBeDefined();
    expect(august2027?.examDate).toBe("8 August 2027");
    expect(august2027?.applicationOpenAt).toBe("10 May 2027");
    expect(august2027?.isHistorical).toBe(false);

    const august2026 = getExamSessionById("session-2026-08-09");
    expect(august2026).toBeDefined();
    expect(august2026?.examDate).toBe("9 August 2026");
    expect(august2026?.isHistorical).toBe(true);
    expect(august2026?.historicalNote).toContain("Historical record");
  });

  it("does not populate testing centers for unannounced future sessions", () => {
    // 14 March 2027 testing centers are not yet published in an exam-specific announcement
    const result2027 = getTestingCentersByFilter({
      examSessionId: "session-2027-03-14",
    });
    expect(result2027.centers).toHaveLength(0);
    expect(result2027.totalAnnounced).toBe(0);
  });

  it("retrieves historical 9 August 2026 testing centers with complete regional coverage", () => {
    const result = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
    });
    expect(result.centers.length).toBeGreaterThanOrEqual(60);
    expect(result.hasAmendments).toBe(true);
  });

  it("filters testing centers by specific CSC region", () => {
    const reg8 = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      regionCode: "region-8",
    });
    expect(reg8.centers.length).toBeGreaterThan(0);
    reg8.centers.forEach((center) => {
      expect(center.regionCode).toBe("region-8");
    });
  });

  it("accurately reflects amendments from Announcement No. 04, s. 2026", () => {
    // 1. Masbate City was added in Region V
    const reg5 = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      regionCode: "region-5",
    });
    const masbate = reg5.centers.find((c) => c.locality === "Masbate City");
    expect(masbate).toBeDefined();
    expect(masbate?.status).toBe("added");
    expect(masbate?.changeNote).toContain("Announcement No. 04");

    // 2. Tangub City was added in Region X
    const reg10 = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      regionCode: "region-10",
    });
    const tangub = reg10.centers.find((c) => c.locality === "Tangub City");
    expect(tangub).toBeDefined();
    expect(tangub?.status).toBe("added");

    // 3. Region VIII: Calbayog City transferred from Catbalogan City (both preserved)
    const reg8 = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      regionCode: "region-8",
    });
    const calbayog = reg8.centers.find((c) => c.locality === "Calbayog City");
    const catbalogan = reg8.centers.find((c) => c.locality === "Catbalogan City");
    expect(calbayog).toBeDefined();
    expect(calbayog?.previousLocality).toBe("Catbalogan City");
    expect(catbalogan).toBeDefined();
    expect(catbalogan?.changeNote).toContain("Superseded");

    // 4. NCR: Caloocan City removed
    const ncr = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      regionCode: "ncr",
    });
    const caloocan = ncr.centers.find((c) => c.locality === "Caloocan City");
    expect(caloocan).toBeDefined();
    expect(caloocan?.status).toBe("removed");
  });

  it("filters testing centers by search query", () => {
    const search = getTestingCentersByFilter({
      examSessionId: "session-2026-08-09",
      query: "Cebu",
    });
    expect(search.centers.length).toBeGreaterThan(0);
    expect(search.centers.some((c) => c.locality.includes("Cebu City"))).toBe(true);
  });

  it("sorts advisories by priority with urgent notices on top", () => {
    const advisories = getOfficialAdvisories();
    expect(advisories.length).toBeGreaterThanOrEqual(2);
    expect(advisories[0].priority).toBe("urgent");
    expect(advisories[0].type).toBe("suspension");
    expect(advisories[0].affectedRegionCodes).toContain("ncr");
  });

  it("provides all 16 official CSC regional offices with valid contact info and official URLs", () => {
    const offices = getAllRegionalOffices();
    expect(offices.length).toBe(16);

    offices.forEach((office) => {
      expect(office.code).toBeDefined();
      expect(office.name).toBeDefined();
      expect(office.officialPageUrl).toMatch(/^https:\/\/(www\.)?csc\.gov\.ph/);
      expect(office.contactDetails?.address).toBeDefined();
      expect(office.contactDetails?.telephone?.length).toBeGreaterThan(0);
    });

    // Check Region I specific portal
    const reg1 = getRegionalOfficeByCode("region-1");
    expect(reg1?.applicationPortal?.type).toBe("ocseas");
    expect(reg1?.applicationPortal?.url).toContain("ocseas.csc.gov.ph/roi");
    expect(reg1?.applicationPortal?.warning).toContain("Region I applicants only");

    // Check NCR specific portal
    const ncr = getRegionalOfficeByCode("ncr");
    expect(ncr?.applicationPortal?.type).toBe("eserve");
    expect(ncr?.applicationPortal?.url).toContain("services.csc.gov.ph");
  });

  it("isolates Region I login link and prevents it from being marked universal", () => {
    const links = getOfficialLinks();
    const roiLogin = links.find((l) => l.id === "link-ocseas-roi");
    expect(roiLogin).toBeDefined();
    expect(roiLogin?.regionScope).toBe("Region I Only");
    expect(roiLogin?.warning).toContain("Restricted to Region I applicants");

    const generalSelector = links.find((l) => l.id === "link-ocseas-selector");
    expect(generalSelector).toBeDefined();
    expect(generalSelector?.regionScope).toBeUndefined();
    expect(generalSelector?.url).toBe("https://ocseas.csc.gov.ph/home");
  });

  it("ensures all cited sources point to official verified CSC domains", () => {
    const sources = getAllOfficialSources();
    expect(sources.length).toBeGreaterThanOrEqual(10);

    sources.forEach((source) => {
      expect(source.publisher).toBe("Civil Service Commission");
      expect(source.officialDomain).toBe(true);
      expect(isOfficialCscUrl(source.url)).toBe(true);
      expect(getOfficialSourceById(source.id)).toBeDefined();
    });
  });
});
