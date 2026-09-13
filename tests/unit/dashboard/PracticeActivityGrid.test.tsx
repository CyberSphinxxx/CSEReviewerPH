import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PracticeActivityGrid } from "@/features/dashboard/PracticeActivityGrid";
import { LocalStorageService } from "@/lib/storage";

describe("PracticeActivityGrid Component", () => {
  it("renders streak headline with correct pluralization (D09)", () => {
    render(<PracticeActivityGrid streakDays={1} />);

    // Pluralization: 1 day, not "1 days"
    expect(screen.getByText(/1 day study streak/i)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/Streak rule:/i)).toBeInTheDocument();
  });

  it("renders pluralized streak for multiple days", () => {
    render(<PracticeActivityGrid streakDays={4} />);

    expect(screen.getByText(/4 days study streak/i)).toBeInTheDocument();
  });

  it("renders activity grid cells and displays date details on interaction", () => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.recordDailyCheckIn();

    render(<PracticeActivityGrid streakDays={0} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(10);

    // Click on a cell and verify date summary updates
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Consistency Tracker/i)).toBeInTheDocument();
  });
});
