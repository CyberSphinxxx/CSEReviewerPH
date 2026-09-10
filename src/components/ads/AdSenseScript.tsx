"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, type CookieConsentState } from "@/components/privacy/CookieConsentBanner";

interface AdSenseScriptProps {
  clientId?: string;
}

export function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const effectiveClientId =
    clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

  const [canLoadAds, setCanLoadAds] = useState(false);

  useEffect(() => {
    // Determine whether user has consented to advertising cookies
    const checkConsent = () => {
      const consent = getStoredConsent();
      // If user hasn't chosen yet, or has chosen and allowed ads
      // In accordance with Google EU/PH consent guidelines, we only load ads if not explicitly declined
      if (!consent || consent.ads) {
        setCanLoadAds(true);
      } else {
        setCanLoadAds(false);
      }
    };

    checkConsent();

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentState>;
      if (customEvent.detail) {
        setCanLoadAds(customEvent.detail.ads);
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  if (!effectiveClientId || !canLoadAds) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${effectiveClientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
