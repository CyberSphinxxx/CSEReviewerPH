import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsOverviewPage from "@/app/(app)/settings/page";
import StudyPlanSettingsPage from "@/app/(app)/settings/study/page";
import AppearanceSettingsPage from "@/app/(app)/settings/appearance/page";
import ReadingSettingsPage from "@/app/(app)/settings/reading/page";
import DashboardLayoutSettingsPage from "@/app/(app)/settings/dashboard/page";
import AccountSettingsPage from "@/app/(app)/settings/account/page";
import DataStorageSettingsPage from "@/app/(app)/settings/data/page";
import PrivacySettingsPage from "@/app/(app)/settings/privacy/page";
import HelpAboutSettingsPage from "@/app/(app)/settings/help/page";
import { PreferencesService } from "@/lib/preferences";

describe("Settings Pages Unit Tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    PreferencesService.resetAllPreferences();
  });

  describe("SettingsOverviewPage", () => {
    it("renders all 8 functional category cards with summaries", async () => {
      render(<SettingsOverviewPage />);

      expect(screen.getByText("Study plan")).toBeInTheDocument();
      expect(screen.getByText("Appearance")).toBeInTheDocument();
      expect(screen.getByText("Text & reading")).toBeInTheDocument();
      expect(screen.getByText("Dashboard layout")).toBeInTheDocument();
      expect(screen.getByText("Account & security")).toBeInTheDocument();
      expect(screen.getByText("Data & storage")).toBeInTheDocument();
      expect(screen.getByText("Privacy")).toBeInTheDocument();
      expect(screen.getByText("Help & about")).toBeInTheDocument();

      // Check current-value summary displays
      expect(screen.getByText(/Professional • Target/)).toBeInTheDocument();
      expect(screen.getByText(/System theme • Follows device motion/)).toBeInTheDocument();
    });
  });

  describe("StudyPlanSettingsPage", () => {
    it("allows switching exam level and adjusting daily goal", async () => {
      render(<StudyPlanSettingsPage />);

      expect(screen.getByText("Exam & Level Target")).toBeInTheDocument();
      expect(screen.getByText("Subprofessional Level")).toBeInTheDocument();

      // Switch to Subprofessional
      const subproBtn = screen.getByText("Subprofessional Level").closest("button");
      expect(subproBtn).toBeInTheDocument();
      fireEvent.click(subproBtn!);

      // Click preset 50 questions
      const preset50 = screen.getByText("50 questions / day");
      fireEvent.click(preset50);

      // Save changes
      const saveBtn = screen.getByRole("button", { name: /save changes/i });
      expect(saveBtn).not.toBeDisabled();
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(screen.getByText(/Study plan preferences saved successfully/i)).toBeInTheDocument();
      });

      const updated = PreferencesService.getPreferences();
      expect(updated.study.levelId).toBe("cse-subprofessional");
      expect(updated.study.dailyGoal).toBe(50);
    });
  });

  describe("AppearanceSettingsPage", () => {
    it("renders live component preview and updates theme choice", async () => {
      render(<AppearanceSettingsPage />);

      expect(screen.getByText("Color Theme")).toBeInTheDocument();
      expect(screen.getByText("Theme Live Preview")).toBeInTheDocument();

      // Select Dark theme
      const darkBtn = screen.getByText("Dark theme").closest("button");
      fireEvent.click(darkBtn!);

      const updated = PreferencesService.getPreferences();
      expect(updated.appearance.theme).toBe("dark");

      // Reduce motion toggle
      const reduceMotionOption = screen.getByText("Reduce motion on this site").closest("label");
      const input = reduceMotionOption?.querySelector("input");
      if (input) fireEvent.click(input);

      const motionUpdated = PreferencesService.getPreferences();
      expect(motionUpdated.appearance.reduceMotion).toBe("reduce");
    });
  });

  describe("ReadingSettingsPage", () => {
    it("adjusts font size, line spacing, and reading width", async () => {
      render(<ReadingSettingsPage />);

      expect(screen.getByText("Reading Text Size")).toBeInTheDocument();
      expect(screen.getByText("Live Reading Preview")).toBeInTheDocument();

      // Click Extra Large
      const xlBtn = screen.getByText("Extra Large").closest("button");
      fireEvent.click(xlBtn!);

      // Click Spacious line spacing
      const spaciousBtn = screen.getByText(/Spacious \(1.8\)/).closest("button");
      fireEvent.click(spaciousBtn!);

      const updated = PreferencesService.getPreferences();
      expect(updated.reading.readingTextSize).toBe("extra-large");
      expect(updated.reading.lineSpacing).toBe("spacious");
    });
  });

  describe("DashboardLayoutSettingsPage", () => {
    it("toggles dashboard density and optional sections", async () => {
      render(<DashboardLayoutSettingsPage />);

      expect(screen.getByText("Dashboard Density & Spacing")).toBeInTheDocument();
      expect(screen.getByText("Optional Dashboard Sections")).toBeInTheDocument();

      // Toggle compact spacing
      const compactBtn = screen.getByText("Compact").closest("button");
      fireEvent.click(compactBtn!);

      // Toggle exam calendar visibility switch
      const switchBtn = screen.getByRole("switch", { name: /toggle exam target & calendar card/i });
      fireEvent.click(switchBtn);

      const updated = PreferencesService.getPreferences();
      expect(updated.dashboard.spacing).toBe("compact");
      expect(updated.dashboard.showExamCalendar).toBe(false);
    });
  });

  describe("AccountSettingsPage", () => {
    it("renders guest mode with sign in option for unauthenticated user", async () => {
      render(<AccountSettingsPage />);

      expect(screen.getByText("Using this device as a guest")).toBeInTheDocument();
      expect(screen.getByText("Sign In or Create Free Account")).toBeInTheDocument();
    });
  });

  describe("DataStorageSettingsPage", () => {
    it("renders storage status, backup export, and scoped reset actions", async () => {
      render(<DataStorageSettingsPage />);

      expect(screen.getByText(/Storage Status: Saved on this device/i)).toBeInTheDocument();
      expect(screen.getByText("Download Device Backup")).toBeInTheDocument();
      expect(screen.getByText("Reset Appearance Preferences")).toBeInTheDocument();
      expect(screen.getByText("Reset Reading Comfort")).toBeInTheDocument();
      expect(screen.getByText("Reset Dashboard View")).toBeInTheDocument();
      expect(screen.getByText("Clear Study Data on This Device")).toBeInTheDocument();
    });
  });

  describe("PrivacySettingsPage", () => {
    it("displays essential storage as required and allows opt-in toggles", async () => {
      render(<PrivacySettingsPage />);

      expect(screen.getByText("Strictly Essential Storage")).toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();

      // Toggle analytics consent
      const analyticsSwitch = screen.getByRole("switch", { name: /toggle anonymous performance analytics/i });
      fireEvent.click(analyticsSwitch);

      const updated = PreferencesService.getPreferences();
      expect(updated.privacy.analyticsConsent).toBe(true);
    });
  });

  describe("HelpAboutSettingsPage", () => {
    it("displays FAQ, contact links, non-affiliation notice, and copy diagnostics", async () => {
      render(<HelpAboutSettingsPage />);

      expect(screen.getByText("Help & Support Resources")).toBeInTheDocument();
      expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
      expect(screen.getByText("Official Non-Affiliation Disclaimer:")).toBeInTheDocument();
      expect(screen.getByText("System Diagnostics")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /copy diagnostics/i })).toBeInTheDocument();
    });
  });
});
