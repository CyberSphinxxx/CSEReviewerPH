import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroDiagnosticPlanPreview } from "@/components/home/HeroDiagnosticPlanPreview";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";

describe("HeroDiagnosticPlanPreview Component", () => {
  it("renders the diagnostic-to-study-plan header and completion badge", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Your diagnostic becomes a study plan/i)).toBeInTheDocument();
    expect(screen.getByText(/10-question diagnostic complete/i)).toBeInTheDocument();
  });

  it("renders the 4-step product loop proving the learning cycle", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis")).toBeInTheDocument();
    expect(screen.getByText("Targeted Review")).toBeInTheDocument();
    expect(screen.getByText("Readiness")).toBeInTheDocument();
  });

  it("renders overall score estimate and 80% passing benchmark", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Overall estimate: 62%/i)).toBeInTheDocument();
    expect(screen.getByText(/CSC passing cutoff:/i)).toBeInTheDocument();
    expect(screen.getByText(/62% Current/i)).toBeInTheDocument();
    expect(screen.getByText(/80% Passing Goal/i)).toBeInTheDocument();
  });

  it("renders identified strength and targeted focus area", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Strong: Verbal Ability/i)).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();

    expect(screen.getByText(/Focus next: Numerical Ability/i)).toBeInTheDocument();
    expect(screen.getByText("48%")).toBeInTheDocument();
  });

  it("renders recommended 10-minute drill action", () => {
    render(<HeroDiagnosticPlanPreview />);

    expect(screen.getByText(/Recommended: Percentages — 10-minute drill/i)).toBeInTheDocument();
    expect(screen.getByText(/10 min/i)).toBeInTheDocument();
  });

  it("renders primary diagnostic CTA and secondary practice runner preview link", () => {
    const { rerender } = render(<HeroDiagnosticPlanPreview level="professional" />);

    const cta = screen.getByRole("link", { name: /Start free diagnostic/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/exams/professional/quick");

    const previewLink = screen.getByRole("link", { name: /Preview the practice interface/i });
    expect(previewLink).toBeInTheDocument();
    expect(previewLink).toHaveAttribute("href", "/practice");

    // Dynamic level adjustment
    rerender(<HeroDiagnosticPlanPreview level="subprofessional" />);
    expect(screen.getByRole("link", { name: /Start free diagnostic/i })).toHaveAttribute(
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
