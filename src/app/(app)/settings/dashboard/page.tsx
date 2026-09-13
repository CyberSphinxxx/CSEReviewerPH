"use client";

import React, { useState } from "react";
import { usePreferences } from "@/lib/preferences";
import {
  LayoutGrid,
  Check,
  RotateCcw,
  Calendar,
  Activity,
  Flame,
  BarChart3,
  History,
  Info,
} from "lucide-react";

export default function DashboardLayoutSettingsPage() {
  const { preferences, mounted, updateCategory, resetCategory } = usePreferences();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSpacingChange = (spacing: "comfortable" | "compact") => {
    const res = updateCategory("dashboard", { spacing });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleToggleSection = (key: keyof typeof preferences.dashboard) => {
    const currentVal = preferences.dashboard[key];
    const res = updateCategory("dashboard", { [key]: !currentVal });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleReset = () => {
    resetCategory("dashboard");
    setSaveStatus("Dashboard layout reset to defaults");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  if (!mounted) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  const { spacing, showExamCalendar, showActivityCalendar, showStreakSummary, showSubjectProgress, showRecentSessions } =
    preferences.dashboard;

  const optionalSections = [
    {
      key: "showExamCalendar" as const,
      label: "Exam Target & Calendar Card",
      description: "Shows target exam countdown, official date provenance, and orientation calendar.",
      icon: Calendar,
      active: showExamCalendar,
    },
    {
      key: "showActivityCalendar" as const,
      label: "Practice Activity Grid",
      description: "12-week study contribution heatmap showing daily practice intensity.",
      icon: Activity,
      active: showActivityCalendar,
    },
    {
      key: "showStreakSummary" as const,
      label: "Study Streak Tile",
      description: "Header stat badge tracking consecutive days with completed mock sessions.",
      icon: Flame,
      active: showStreakSummary,
    },
    {
      key: "showSubjectProgress" as const,
      label: "Subject Progress Breakdown",
      description: "Accuracy progress bars across Analytical, Verbal, Numerical, and General Information subtests.",
      icon: BarChart3,
      active: showSubjectProgress,
    },
    {
      key: "showRecentSessions" as const,
      label: "Recent Test Sessions List",
      description: "Quick history of your most recent mock test attempts with scores and timestamps.",
      icon: History,
      active: showRecentSessions,
    },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Autosave Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 h-5">
        <span>Preferences autosave immediately to your current browser.</span>
        {saveStatus && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{saveStatus}</span>
          </span>
        )}
      </div>

      {/* 1. Spacing & Density */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Dashboard Density &amp; Spacing</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Comfortable spacing provides generous breathing room. Compact density tightens padding and gaps for seeing more information on one screen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            {
              id: "comfortable",
              label: "Comfortable (Default)",
              desc: "Standard generous padding and card margins for relaxed daily review.",
            },
            {
              id: "compact",
              label: "Compact",
              desc: "Tighter margins and reduced card padding to maximize visible information.",
            },
          ].map((item) => {
            const isSelected = spacing === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSpacingChange(item.id as "comfortable" | "compact")}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-600 dark:ring-brand-500 shadow-2xs"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.label}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Optional Section Visibility */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Optional Dashboard Sections</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Customize which cards appear on your dashboard. Hiding a section never deletes your saved progress or stops activity recording.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
          {optionalSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.key} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                      {sec.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block leading-relaxed">
                      {sec.description}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={sec.active}
                  aria-label={`Toggle ${sec.label}`}
                  onClick={() => handleToggleSection(sec.key)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                    sec.active ? "bg-brand-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 mt-4">
          <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <span>
            <strong>Stable anchors:</strong> Your primary daily study action recommendation (&quot;For today&quot;) and quick drill launches are permanent anchors and remain visible even if all optional cards are hidden.
          </span>
        </div>
      </section>

      {/* Reset Section Action */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset dashboard view to defaults</span>
        </button>
      </div>
    </div>
  );
}
