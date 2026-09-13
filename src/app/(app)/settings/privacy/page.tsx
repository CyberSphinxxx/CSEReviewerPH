"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import {
  getStoredConsent,
  saveStoredConsent,
  type CookieConsentState,
} from "@/components/privacy/CookieConsentBanner";
import {
  Shield,
  Check,
  ExternalLink,
  BarChart2,
  Tv,
  CalendarCheck,
  FileText,
  Trash2,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const { preferences, mounted, updateCategory } = usePreferences();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Read current consent state
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [adsConsent, setAdsConsent] = useState(false);
  const [checkInTracking, setCheckInTracking] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    const consent = getStoredConsent();
    if (consent && consent.hasChosen) {
      setAnalyticsConsent(consent.analytics);
      setAdsConsent(consent.ads);
    } else {
      setAnalyticsConsent(preferences.privacy.analyticsConsent);
      setAdsConsent(preferences.privacy.adsConsent);
    }
    setCheckInTracking(preferences.privacy.localCheckInTracking);
  }, [preferences, mounted]);

  const handleToggleAnalytics = (val: boolean) => {
    setAnalyticsConsent(val);
    // Sync with unified preferences
    updateCategory("privacy", { analyticsConsent: val });
    // Sync with CookieConsentBanner store
    const consentState: CookieConsentState = {
      essential: true,
      analytics: val,
      ads: adsConsent,
      hasChosen: true,
      updatedAt: Date.now(),
    };
    saveStoredConsent(consentState);
    setSaveStatus("Privacy preferences saved");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleToggleAds = (val: boolean) => {
    setAdsConsent(val);
    // Sync with unified preferences
    updateCategory("privacy", { adsConsent: val });
    // Sync with CookieConsentBanner store
    const consentState: CookieConsentState = {
      essential: true,
      analytics: analyticsConsent,
      ads: val,
      hasChosen: true,
      updatedAt: Date.now(),
    };
    saveStoredConsent(consentState);
    setSaveStatus("Privacy preferences saved");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleToggleCheckIn = (val: boolean) => {
    setCheckInTracking(val);
    updateCategory("privacy", { localCheckInTracking: val });
    setSaveStatus("Privacy preferences saved");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  if (!mounted) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Autosave Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 h-5">
        <span>Settings update immediately and synchronize with your consent choices.</span>
        {saveStatus && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{saveStatus}</span>
          </span>
        )}
      </div>

      {/* 1. Essential Storage (Required, Non-editable) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>Strictly Essential Storage</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Essential browser storage is strictly required for the core reviewer to function. It cannot be turned off.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Essential keys store your active examination timer, draft question answers, offline attempt persistence, CSRF security tokens, and user display settings.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            No personal demographics, tracking beacons, or cross-site tracking identifiers are ever written into essential storage.
          </p>
        </div>
      </section>

      {/* 2. Optional Consent Controls (Opt-in by default) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Optional Choices (RA 10173)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            In compliance with Republic Act No. 10173, optional data processing is disabled until you provide explicit opt-in consent.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
          {/* Optional Anonymous Analytics */}
          <div className="py-4 first:pt-0 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Anonymous Performance Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Helps us identify difficult examination questions and system errors. All events are aggregated without personal names or emails.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={analyticsConsent}
              aria-label="Toggle anonymous performance analytics"
              onClick={() => handleToggleAnalytics(!analyticsConsent)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 mt-1 ${
                analyticsConsent ? "bg-brand-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Optional Advertising Consent */}
          <div className="py-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Advertising &amp; Ad Partner Consent
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enables privacy-compliant advertising via Google AdSense. Advertising revenue keeps this entire Philippine Civil Service Exam reviewer 100% free for Filipino examinees.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Note: Declining ad consent does not purchase an ad-free tier; ads may still render with generic, non-personalized placements.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={adsConsent}
              aria-label="Toggle advertising consent"
              onClick={() => handleToggleAds(!adsConsent)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 mt-1 ${
                adsConsent ? "bg-brand-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Local Daily Check-in Tracking */}
          <div className="py-4 last:pb-0 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Local Daily Check-in Tracking
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Records calendar visit dates locally on your device to maintain your practice activity grid. Turning this off stops logging visit-only check-ins, while test attempt records continue to save.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={checkInTracking}
              aria-label="Toggle daily check-in tracking"
              onClick={() => handleToggleCheckIn(!checkInTracking)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 mt-1 ${
                checkInTracking ? "bg-brand-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Links to Public Legal Notice & Rights */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Privacy Rights</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Read our public privacy disclosure or exercise your rights to data portability and erasure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href="/privacy"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Read Privacy Notice (RA 10173)
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            href="/settings/account#delete"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Right to Erasure / Deletion
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
