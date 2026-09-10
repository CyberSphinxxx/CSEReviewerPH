// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QuestionReportModal } from "@/features/practice/QuestionReportModal";

describe("QuestionReportModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    questionId: "q-test-101",
    questionText: "Sample Philippine Civil Service Constitution item.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(<QuestionReportModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders modal header, target question, and reason options when open", () => {
    render(<QuestionReportModal {...defaultProps} />);

    expect(screen.getByText("Report an Issue with Question")).toBeInTheDocument();
    expect(screen.getByText(/Sample Philippine Civil Service Constitution/)).toBeInTheDocument();
    expect(screen.getByText("Factual / Answer Key Error")).toBeInTheDocument();
    expect(screen.getByText("Typo or Grammar Issue")).toBeInTheDocument();
    expect(screen.getByText("Unclear / Incomplete Rationale")).toBeInTheDocument();
  });

  it("submits report to API and displays success state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, reportId: "rep-123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionReportModal {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/reference citation/i);
    fireEvent.change(textarea, { target: { value: "Section 3 Article IX-B clarification." } });

    const submitBtn = screen.getByRole("button", { name: /Submit Report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/questions/report",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Section 3 Article IX-B clarification."),
        })
      );
      expect(screen.getByText("Report Submitted")).toBeInTheDocument();
    });
  });

  it("invokes onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    render(<QuestionReportModal {...defaultProps} onClose={onClose} />);

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
