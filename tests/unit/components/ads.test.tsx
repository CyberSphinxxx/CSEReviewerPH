import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { saveStoredConsent } from "@/components/privacy/CookieConsentBanner";

describe("AdSenseBanner Component — AdSense Policy & Layout Safety", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    localStorage.clear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("renders preview placeholder banner when client ID or slot is unconfigured", () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    render(<AdSenseBanner />);

    expect(screen.getByLabelText(/Advertisement Placeholder/i)).toBeInTheDocument();
    expect(screen.getByText(/Google AdSense Placement/i)).toBeInTheDocument();
    expect(screen.getByText(/AdSense Ready Slot/i)).toBeInTheDocument();
  });

  it("renders ins.adsbygoogle unit when client ID and slot are configured", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    const { container } = render(
      <AdSenseBanner slotId="test-slot-123" format="auto" />
    );

    expect(screen.getByLabelText("Advertisement")).toBeInTheDocument();

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).toBeDefined();
    expect(ins?.getAttribute("data-ad-client")).toBe("ca-pub-1234567890123456");
    expect(ins?.getAttribute("data-ad-slot")).toBe("test-slot-123");
    expect(ins?.getAttribute("data-ad-format")).toBe("auto");
  });

  it("does not render when user has declined advertising cookies", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    // Explicitly reject advertising
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: false,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    const { container } = render(
      <AdSenseBanner slotId="test-slot-123" />
    );

    expect(container.firstChild).toBeNull();
  });
});
