import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroDiagnosticPlanPreview } from "@/components/home/HeroDiagnosticPlanPreview";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";

describe("HeroDiagnosticPlanPreview Component", () => {
  it("renders the diagnostic plan header and example outcome labels", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/YOUR DIAGNOSTIC PLAN/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Outcome/i)).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  it("renders estimated readiness metric and 80% benchmark reference", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Estimated readiness/i)).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByText(/80% goal/i)).toBeInTheDocument();
  });

  it("renders identified subtest focus and strength indicators", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText("Numerical Ability")).toBeInTheDocument();
    expect(screen.getByText("Needs focus")).toBeInTheDocument();

    expect(screen.getByText("Verbal Ability")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("renders next recommended drill card with 10-minute estimate", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Next recommended drill/i)).toBeInTheDocument();
    expect(screen.getByText(/Percentages & Interest/i)).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("renders primary action and secondary preview link with dynamic level prop", () => {
    const { rerender } = render(<HeroDiagnosticPlanPreview level="professional" />);

    const cta = screen.getByRole("link", { name: /Start focused practice/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/exams/professional/quick");

    const previewLink = screen.getByRole("link", { name: /Preview the practice interface/i });
    expect(previewLink).toBeInTheDocument();
    expect(previewLink).toHaveAttribute("href", "/#how-it-works");

    // Dynamic level adjustment
    rerender(<HeroDiagnosticPlanPreview level="subprofessional" />);
    expect(screen.getByRole("link", { name: /Start focused practice/i })).toHaveAttribute(
      "href",
      "/exams/subprofessional/quick"
    );
  });
});

describe("SubtestExplorer Component", () => {
  it("renders all 5 Civil Service subtest tabs with item counts", () => {
    render(<SubtestExplorer />);

    expect(screen.getByRole("button", { name: /Verbal Ability 50Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Numerical Ability 40Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Analytical Ability 30Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /General Information 20Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clerical Ability 30Q/i })).toBeInTheDocument();
  });

  it("switches to Analytical Ability and verifies Professional exclusivity", () => {
    render(<SubtestExplorer />);

    const analyticalTab = screen.getByRole("button", { name: /Analytical Ability 30Q/i });
    fireEvent.click(analyticalTab);

    expect(screen.getByText("Professional Level Only")).toBeInTheDocument();
    expect(screen.getByText(/Formal Logic, Syllogisms & Conditional Statements/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice Analytical Ability/i })).toHaveAttribute("href", "/practice");
  });

  it("switches to Clerical Ability and verifies Subprofessional exclusivity", () => {
    render(<SubtestExplorer />);

    const clericalTab = screen.getByRole("button", { name: /Clerical Ability 30Q/i });
    fireEvent.click(clericalTab);

    expect(screen.getByText("Subprofessional Level Only")).toBeInTheDocument();
    expect(screen.getByText(/Alphabetical Filing Rules & Standard Office Indexing/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice Clerical Ability/i })).toHaveAttribute("href", "/practice");
  });
});
