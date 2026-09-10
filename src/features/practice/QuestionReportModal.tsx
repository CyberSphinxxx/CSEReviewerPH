"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

interface QuestionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionText: string;
}

const REPORT_REASONS: { value: string; label: string; description: string }[] = [
  {
    value: "factual_error",
    label: "Factual / Answer Key Error",
    description: "The marked correct answer appears incorrect or outdated per Philippine Civil Service rules.",
  },
  {
    value: "typo",
    label: "Typo or Grammar Issue",
    description: "Spelling, punctuation, or grammatical errors in the question or choices.",
  },
  {
    value: "bad_explanation",
    label: "Unclear / Incomplete Rationale",
    description: "The step-by-step solution is confusing, missing, or difficult to follow.",
  },
  {
    value: "formatting",
    label: "Display / Formatting Glitch",
    description: "Issues with spacing, symbols, table alignments, or truncated text.",
  },
  {
    value: "other",
    label: "Other Feedback",
    description: "General suggestion or pedagogical feedback for our editorial team.",
  },
];

export function QuestionReportModal({
  isOpen,
  onClose,
  questionId,
  questionText,
}: QuestionReportModalProps) {
  const [reason, setReason] = useState<string>("factual_error");
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/questions/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          reason,
          comments: comments.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit report.");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setComments("");
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSubmitted(false);
      setErrorMessage(null);
      setComments("");
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="report-modal-title" className="text-base font-bold text-slate-900">
                Report an Issue with Question
              </h3>
              <p className="text-[11px] text-slate-500">
                Help us keep all review questions accurate, fair, and pedagogically sound.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Question context snippet */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Question
            </div>
            <p className="line-clamp-2 italic font-medium">{questionText}</p>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Report Submitted</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you! Our editorial review team has received your feedback for verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Reason selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What issue did you encounter?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((r) => {
                    const isSelected = reason === r.value;
                    return (
                      <label
                        key={r.value}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? "bg-brand-50/60 border-brand-300 ring-1 ring-brand-400"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="report_reason"
                          value={r.value}
                          checked={isSelected}
                          onChange={(e) => setReason(e.target.value)}
                          className="mt-0.5 text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{r.label}</div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            {r.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Additional comments */}
              <div>
                <label
                  htmlFor="report-comments"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Additional Details / Suggested Correction (Optional)
                </label>
                <textarea
                  id="report-comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Provide reference citation, rule number, or correct explanation if known..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-800 placeholder-slate-400"
                />
                <div className="text-right text-[10px] text-slate-400 mt-0.5">
                  {comments.length}/1000 characters
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Report</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
