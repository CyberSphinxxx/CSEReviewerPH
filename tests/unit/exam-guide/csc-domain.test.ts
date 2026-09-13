import { describe, it, expect } from "vitest";
import {
  isOfficialCscUrl,
  getDomainBadge,
  getSafeExternalLinkProps,
  ALLOWED_OFFICIAL_CSC_DOMAINS,
  CSC_LOGIN_SECURITY_DISCLAIMER,
  CSE_REVIEWER_INDEPENDENCE_DISCLAIMER,
} from "@/lib/exam-guide/csc-domain";

describe("CSC Official Domain Validation and Security", () => {
  it("approves all allowlisted CSC domains with HTTPS", () => {
    ALLOWED_OFFICIAL_CSC_DOMAINS.forEach((domain) => {
      expect(isOfficialCscUrl(`https://${domain}/`)).toBe(true);
      expect(isOfficialCscUrl(`https://${domain}/path/to/resource?query=1`)).toBe(true);
    });
  });

  it("approves genuine csc.gov.ph subdomains", () => {
    expect(isOfficialCscUrl("https://erpo.csc.gov.ph/eNOSAv3/")).toBe(true);
    expect(isOfficialCscUrl("https://services.csc.gov.ph/applicant")).toBe(true);
    expect(isOfficialCscUrl("https://ocseas.csc.gov.ph/roi/client/login")).toBe(true);
  });

  it("rejects non-CSC domains, lookalikes, and spoofing attempts", () => {
    // Lookalikes trying to trick regex
    expect(isOfficialCscUrl("https://csc.gov.ph.attacker.com/login")).toBe(false);
    expect(isOfficialCscUrl("https://fake-csc.gov.ph/portal")).toBe(false);
    expect(isOfficialCscUrl("https://cscgovph.com/")).toBe(false);
    expect(isOfficialCscUrl("https://www.csc.gov.ph.phishingsite.net/")).toBe(false);
    expect(isOfficialCscUrl("https://google.com/")).toBe(false);
    expect(isOfficialCscUrl("javascript:alert(1)")).toBe(false);
    expect(isOfficialCscUrl("data:text/html,evil")).toBe(false);
    expect(isOfficialCscUrl("")).toBe(false);
    expect(isOfficialCscUrl("not-a-valid-url")).toBe(false);
  });

  it("extracts correct domain badge for UI rendering", () => {
    expect(getDomainBadge("https://ocseas.csc.gov.ph/home")).toBe("ocseas.csc.gov.ph");
    expect(getDomainBadge("https://www.csc.gov.ph/career/")).toBe("www.csc.gov.ph");
    expect(getDomainBadge("invalid-url")).toBe("csc.gov.ph");
  });

  it("generates safe external link attributes with rel noopener noreferrer", () => {
    const url = "https://ocseas.csc.gov.ph/home";
    const props = getSafeExternalLinkProps(url);

    expect(props.href).toBe(url);
    expect(props.target).toBe("_blank");
    expect(props.rel).toBe("noopener noreferrer");
    expect(props["data-official-domain"]).toBe("true");
  });

  it("marks unofficial domains appropriately in data attributes", () => {
    const unsafeUrl = "https://example.com/spoof";
    const props = getSafeExternalLinkProps(unsafeUrl);

    expect(props.href).toBe(unsafeUrl);
    expect(props.target).toBe("_blank");
    expect(props.rel).toBe("noopener noreferrer");
    expect(props["data-official-domain"]).toBe("false");
  });

  it("provides clear independence and login safety disclaimers", () => {
    expect(CSC_LOGIN_SECURITY_DISCLAIMER).toContain("verified csc.gov.ph domain");
    expect(CSE_REVIEWER_INDEPENDENCE_DISCLAIMER).toContain("independent exam-preparation platform");
    expect(CSE_REVIEWER_INDEPENDENCE_DISCLAIMER).toContain("not affiliated with or endorsed by the Civil Service Commission");
  });
});
