"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import {
  Calendar,
  Palette,
  Type,
  LayoutGrid,
  User,
  Database,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export default function SettingsOverviewPage() {
  const { preferences, mounted } = usePreferences();
  const { data: session } = useSession();
  const [attemptCount, setAttemptCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    try {
      const history = LocalStorageService.getAttemptHistory();
      const bookmarks = LocalStorageService.getBookmarks();
      setAttemptCount(history.length);
      setBookmarkCount(bookmarks.length);
    } catch {
      // Ignore
    }
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  // Calculate current-value summaries
  const levelLabel = preferences.study.levelId.includes("subprof") ? "Subprofessional" : "Professional";
  const targetSummary = preferences.study.targetDate
    ? `Target: ${preferences.study.targetDate}`
    : "No target date set";
  const studySummary = `${levelLabel} • ${targetSummary} • ${preferences.study.dailyGoal} questions/day`;

  const themeLabel =
    preferences.appearance.theme === "system"
      ? "System theme"
      : preferences.appearance.theme === "dark"
      ? "Dark theme"
      : "Light theme";
  const motionLabel =
    preferences.appearance.reduceMotion === "reduce" ? "Reduced motion" : "Follows device motion";
  const appearanceSummary = `${themeLabel} • ${motionLabel}`;

  const sizeLabel =
    preferences.reading.readingTextSize === "extra-large"
      ? "Extra large (20px)"
      : preferences.reading.readingTextSize === "large"
      ? "Large (18px)"
      : "Standard (16px)";
  const readingSummary = `${sizeLabel} • ${preferences.reading.lineSpacing === "spacious" ? "1.8 line height" : "1.6 line height"} • ${preferences.reading.readingWidth === "narrow" ? "Narrow (52ch)" : "Standard (65ch)"}`;

  const visibleSectionsCount = [
    preferences.dashboard.showExamCalendar,
    preferences.dashboard.showActivityCalendar,
    preferences.dashboard.showStreakSummary,
    preferences.dashboard.showSubjectProgress,
    preferences.dashboard.showRecentSessions,
  ].filter(Boolean).length;
  const dashboardSummary = `${preferences.dashboard.spacing === "compact" ? "Compact density" : "Comfortable density"} • ${visibleSectionsCount} of 5 optional sections visible`;

  const accountSummary = session?.user
    ? `Signed in as ${session.user.name || session.user.email}`
    : "Using this device as a guest (offline local storage)";

  const dataSummary = `Saved on this device • ${attemptCount} ${attemptCount === 1 ? "attempt" : "attempts"} • ${bookmarkCount} ${bookmarkCount === 1 ? "bookmark" : "bookmarks"}`;

  const privacySummary = `Essential storage active • Analytics: ${preferences.privacy.analyticsConsent ? "On" : "Off"} • Ads: ${preferences.privacy.adsConsent ? "On" : "Off"}`;

  const helpSummary = "FAQ, contact support, question reporting, and system diagnostics";

  const categories = [
    {
      title: "Study plan",
      href: "/settings/study",
      icon: Calendar,
      summary: studySummary,
      description: "Exam level, target exam countdown, daily pacing goal, and calendar settings.",
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
      icon: Palette,
      summary: appearanceSummary,
      description: "Light, dark, and system color themes, live component preview, and animation controls.",
    },
    {
      title: "Text & reading",
      href: "/settings/reading",
      icon: Type,
      summary: readingSummary,
      description: "Text size, line spacing, and line width for exam questions, rationales, and study guides.",
    },
    {
      title: "Dashboard layout",
      href: "/settings/dashboard",
      icon: LayoutGrid,
      summary: dashboardSummary,
      description: "Comfortable vs compact view and toggle visibility for optional dashboard sections.",
    },
    {
      title: "Account & security",
      href: "/settings/account",
      icon: User,
      summary: accountSummary,
      description: "Review your authenticated profile, edit display name, or securely delete cloud account data.",
    },
    {
      title: "Data & storage",
      href: "/settings/data",
      icon: Database,
      summary: dataSummary,
      description: "Cloud synchronization, download device backup, restore backup JSON, and distinct data resets.",
    },
    {
      title: "Privacy",
      href: "/settings/privacy",
      icon: Shield,
      summary: privacySummary,
      description: "Essential storage transparency, optional analytics and advertising opt-ins, and visit check-in logging.",
    },
    {
      title: "Help & about",
      href: "/settings/help",
      icon: HelpCircle,
      summary: helpSummary,
      description: "Help guides, contact support, question reporting guidelines, and safe system diagnostics.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition flex items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-700 dark:group-hover:bg-brand-950/60 dark:group-hover:text-brand-400 transition shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                      {cat.title}
                    </h2>
                  </div>
                  <div className="text-xs font-semibold text-brand-700 dark:text-brand-400 truncate">
                    {cat.summary}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1 sm:line-clamp-none">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pt-1 sm:pt-0">
                <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
