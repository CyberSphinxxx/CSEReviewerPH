import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardView } from "@/features/dashboard/DashboardView";

describe("DashboardView Component", () => {
  it("renders accuracy, test count, streak, and subtests", () => {
    render(<DashboardView />);

    expect(screen.getByText("User Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Overall Accuracy")).toBeInTheDocument();
    expect(screen.getByText("Tests Completed")).toBeInTheDocument();
    expect(screen.getByText("Study Streak")).toBeInTheDocument();
    expect(screen.getByText("Mistake Bank")).toBeInTheDocument();
    expect(screen.getByText("Saved Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Civil Service Subtest Readiness")).toBeInTheDocument();
  });
});
