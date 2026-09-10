"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredConsent, type CookieConsentState } from "@/components/privacy/CookieConsentBanner";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export interface AdSenseBannerProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSenseBanner({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adsAllowed, setAdsAllowed] = useState(true);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const isConfigured = Boolean(clientId && slotId);

  useEffect(() => {
    // Check initial cookie consent
    const consent = getStoredConsent();
    if (consent && !consent.ads) {
      setAdsAllowed(false);
    } else {
      setAdsAllowed(true);
    }

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentState>;
      if (customEvent.detail) {
        setAdsAllowed(customEvent.detail.ads);
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isConfigured || !adsAllowed) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        // Push ad call to AdSense queue if not already initialized
        if (!adLoaded) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      }
    } catch {
      // AdSense push errors are caught silently in preview/dev
    }
  }, [isConfigured, adsAllowed, adLoaded]);

  // If user declined advertising cookies, hide ad container completely
  if (!adsAllowed) {
    return null;
  }

  // If Google AdSense is not configured with client ID and slot ID, show clean development/preview placeholder
  if (!isConfigured) {
    return (
      <aside
        aria-label="Advertisement Placeholder"
        className={`my-6 mx-auto w-full max-w-4xl px-4 ${className}`}
      >
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center transition">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <span>Advertisement</span>
            <span>AdSense Ready Slot</span>
          </div>
          <div className="py-4 flex flex-col items-center justify-center space-y-1">
            <p className="text-xs font-semibold text-slate-600">
              Google AdSense Placement
            </p>
            <p className="text-[11px] text-slate-400 max-w-md">
              Configure <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-700">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> and slot ID to serve verified responsive ad units.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Active production AdSense unit
  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 mx-auto w-full max-w-4xl px-4 overflow-hidden ${className}`}
    >
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase text-center mb-1">
        Advertisement
      </div>
      <div className="min-h-[100px] flex items-center justify-center bg-slate-50/50 rounded-lg overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", ...style }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
