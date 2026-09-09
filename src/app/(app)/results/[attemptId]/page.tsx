"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResultsView, type AttemptData } from "@/features/results/ResultsView";
import { SEED_QUESTIONS } from "@/db/seed-data";
import { calculateScore } from "@/features/exam-engine";

import { LocalStorageService } from "@/lib/storage";

export default function ResultsPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [attemptData, setAttemptData] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;

    const stored = LocalStorageService.getAttemptDetails(attemptId);
    if (stored) {
      setAttemptData(stored as unknown as AttemptData);
      setIsLoading(false);
      return;
    }

    // Fallback: create mock completed attempt data for preview / direct link
    const sampleQuestions = SEED_QUESTIONS.slice(0, 10);
    const sampleAnswers = sampleQuestions.map((q, idx) => ({
      questionId: q.id,
      selectedChoiceId: idx % 4 === 0 ? "wrong-id" : q.choices.find((c) => c.isCorrect)?.id || null,
      isFlagged: idx === 1,
      timeSpentSeconds: 25,
    }));

    const scoreResult = calculateScore(sampleQuestions, sampleAnswers, 80, 250);

    setAttemptData({
      id: attemptId,
      title: "Career Service Examination — Quick Diagnostic Test",
      mode: "quick",
      questions: sampleQuestions,
      answers: sampleAnswers,
      scoreResult,
      completedAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, [attemptId]);

  if (isLoading || !attemptData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Calculating your performance breakdown...</p>
        </div>
      </div>
    );
  }

  return <ResultsView attemptData={attemptData} />;
}
