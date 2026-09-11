import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSimulatorPreview } from "@/components/home/HeroSimulatorPreview";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";

describe("HeroSimulatorPreview Component", () => {
  it("renders live simulator with single continuous timer badge and question content", () => {
    render(<HeroSimulatorPreview />);

    // Timer badge
    expect(screen.getByText("03:09:42")).toBeInTheDocument();
    expect(screen.getByText(/Single Continuous Timer/i)).toBeInTheDocument();

    // Item counter & question body
    expect(screen.getByText(/Item 42 of 170/i)).toBeInTheDocument();
    expect(screen.getByText(/Republic Act No. 6713/i)).toBeInTheDocument();

    // Choices
    expect(screen.getByText(/Within 15 working days from receipt/i)).toBeInTheDocument();
    expect(screen.getByText(/Within 7 working days from receipt/i)).toBeInTheDocument();
  });

  it("handles choice selection and displays instant pedagogical rationale", () => {
    render(<HeroSimulatorPreview />);

    // Select Choice A
    const choiceA = screen.getByText(/Within 7 working days from receipt/i);
    fireEvent.click(choiceA);

    // Instant rationale should be visible
    expect(screen.getByText(/Instant Rationale • Official Legal Basis/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 5\(a\) of RA 6713 explicitly mandates/i)).toBeInTheDocument();
  });

  it("allows eliminating distractors and restoring them", () => {
    render(<HeroSimulatorPreview />);

    const eliminateBtns = screen.getAllByRole("button", { name: /Eliminate/i });
    expect(eliminateBtns.length).toBeGreaterThan(0);

    // Click eliminate on one of the active buttons
    fireEvent.click(eliminateBtns[0]);

    // Should have a restore button now
    expect(screen.getAllByRole("button", { name: /Restore/i }).length).toBeGreaterThan(0);
  });

  it("switches to the virtual scratchpad simulation tab and returns", () => {
    render(<HeroSimulatorPreview />);

    const scratchpadBtn = screen.getByRole("button", { name: /Scratchpad/i });
    fireEvent.click(scratchpadBtn);

    // Verify scratchpad content
    expect(screen.getByText(/Virtual Scratchpad \(Physical Calculators Prohibited\)/i)).toBeInTheDocument();
    expect(screen.getByText(/190 min \/ 170 items = 1.117 min = 67.05 seconds\/item/i)).toBeInTheDocument();

    // Return to item
    const returnBtn = screen.getByRole("button", { name: /Return to Item/i });
    fireEvent.click(returnBtn);

    // Question visible again
    expect(screen.getByText(/Republic Act No. 6713/i)).toBeInTheDocument();
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
