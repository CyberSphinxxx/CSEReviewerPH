"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, ChevronLeft, Award } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  mode: string;
  percentage: number;
  passed: boolean;
  date: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("attempts_history") || "[]");
      setHistory(saved);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
              <History className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Complete Test History</h1>
              <p className="text-xs text-slate-500">Record of your past examination simulations and drills.</p>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completed on {new Date(item.date).toLocaleString()} &bull;{" "}
                      <span className="capitalize font-semibold">{item.mode}</span> Mode
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-lg font-black font-mono ${
                          item.passed ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {item.percentage}%
                      </span>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        {item.passed ? "PASSED" : "NEEDS REVIEW"}
                      </span>
                    </div>

                    <Link
                      href={`/results/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-800 font-bold text-xs transition"
                    >
                      View Breakdown
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No test attempts recorded yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Completed quick tests, medium tests, and full mock exams will appear here automatically.
              </p>
              <Link
                href="/exams/professional/quick"
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs shadow hover:bg-brand-800 transition"
              >
                Launch First Quick Test
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
