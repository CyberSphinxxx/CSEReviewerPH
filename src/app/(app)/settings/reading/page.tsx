"use client";

import React, { useState } from "react";
import { usePreferences } from "@/lib/preferences";
import {
  Type,
  Check,
  RotateCcw,
  BookOpen,
  Info,
  AlignLeft,
  MoveHorizontal,
} from "lucide-react";

export default function ReadingSettingsPage() {
  const { preferences, mounted, updateCategory, resetCategory } = usePreferences();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSizeChange = (readingTextSize: "standard" | "large" | "extra-large") => {
    const res = updateCategory("reading", { readingTextSize });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleSpacingChange = (lineSpacing: "standard" | "spacious") => {
    const res = updateCategory("reading", { lineSpacing });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleWidthChange = (readingWidth: "standard" | "narrow") => {
    const res = updateCategory("reading", { readingWidth });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleReset = () => {
    resetCategory("reading");
    setSaveStatus("Reading preferences reset to defaults");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  if (!mounted) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  const { readingTextSize, lineSpacing, readingWidth } = preferences.reading;

  const sizeStyles: Record<string, string> = {
    standard: "text-base", // 16px
    large: "text-lg", // 18px
    "extra-large": "text-xl", // 20px
  };

  const spacingStyles: Record<string, string> = {
    standard: "leading-relaxed", // 1.625
    spacious: "leading-loose", // 2.0
  };

  const widthStyles: Record<string, string> = {
    standard: "max-w-[65ch]",
    narrow: "max-w-[52ch]",
  };

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

      {/* 1. Text Size */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Reading Text Size</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Scales body text for exam questions, rationales, study guides, and review notes. Browser zoom remains available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: "standard", label: "Standard", desc: "16px base size", tag: "Default" },
            { id: "large", label: "Large", desc: "18px base size", tag: "Comfortable" },
            { id: "extra-large", label: "Extra Large", desc: "20px base size", tag: "High legibility" },
          ].map((item) => {
            const isSelected = readingTextSize === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSizeChange(item.id as "standard" | "large" | "extra-large")}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
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
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.desc} &bull; <span className="text-brand-700 dark:text-brand-400 font-medium">{item.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Line Spacing & Reading Column Width */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-2xs">
        {/* Line Spacing */}
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>Line Spacing</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Vertical line height between sentences in paragraphs and rationale explanations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "standard", label: "Standard (1.6)", desc: "Balanced vertical spacing" },
              { id: "spacious", label: "Spacious (1.8)", desc: "Generous breathing room" },
            ].map((item) => {
              const isSelected = lineSpacing === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSpacingChange(item.id as "standard" | "spacious")}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? "border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-600 dark:ring-brand-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Width */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>Reading Column Width</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Maximum character width for long explanations and study guides (both adapt to fit mobile viewports).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "standard", label: "Standard (~65ch)", desc: "Optimal reading line length" },
              { id: "narrow", label: "Narrow (~52ch)", desc: "Compact focused column" },
            ].map((item) => {
              const isSelected = readingWidth === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleWidthChange(item.id as "standard" | "narrow")}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? "border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-600 dark:ring-brand-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Live Reading Preview (required per §6) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Live Reading Preview</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Demonstrates real reflow, text scale, line spacing, and column width.
          </p>
        </div>

        {/* Live Container applying the active tokens */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className={`${widthStyles[readingWidth]} mx-auto space-y-3`}>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Sample Concept Summary &bull; Philippine Constitution
            </div>

            <p className={`${sizeStyles[readingTextSize]} ${spacingStyles[lineSpacing]} text-slate-800 dark:text-slate-200 font-normal`}>
              Under the 1987 Philippine Constitution, public office is a public trust. Public officers and employees must at all times be accountable to the people, serve them with utmost responsibility, integrity, loyalty, and efficiency, act with patriotism and justice, and lead modest lives.
            </p>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Key Exam Takeaway:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Section 1 of Article XI embodies the standard of accountability applicable to all personnel across constitutional bodies and local government units.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <span>
            <strong>Content integrity guarantee:</strong> Display adjustments never modify or simplify exam questions, rationales, equations, or language metadata. Both English and Filipino questions preserve their authentic official phrasing.
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
          <span>Reset reading defaults</span>
        </button>
      </div>
    </div>
  );
}
