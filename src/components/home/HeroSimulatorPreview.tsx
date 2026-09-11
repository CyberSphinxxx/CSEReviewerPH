"use client";

import { useState } from "react";
import { Clock, Flag, Pencil, CheckCircle2, RotateCcw, Sparkles, Lightbulb } from "lucide-react";

interface Choice {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

const SAMPLE_QUESTION = {
  id: "q-hero-preview",
  subtest: "General Information • RA 6713 & Constitutional Law",
  questionNumber: 42,
  totalQuestions: 170,
  prompt:
    "Under Section 5(a) of Republic Act No. 6713 (Code of Conduct and Ethical Standards for Public Officials and Employees), within how many working days must all public officials and employees respond to letters, telegrams, or other communications sent by the public?",
  choices: [
    { id: "A", label: "A", text: "Within 7 working days from receipt", isCorrect: false },
    { id: "B", label: "B", text: "Within 15 working days from receipt", isCorrect: true },
    { id: "C", label: "C", text: "Within 30 calendar days from receipt", isCorrect: false },
    { id: "D", label: "D", text: "Within 60 calendar days from receipt", isCorrect: false },
  ] as Choice[],
  explanation:
    "Section 5(a) of RA 6713 explicitly mandates: 'All public officials and employees shall, within fifteen (15) working days from receipt thereof, respond to letters, telegrams or other means of communications sent by the public. The reply must contain the action taken on the request.'",
};

export function HeroSimulatorPreview() {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>("B");
  const [eliminatedChoiceIds, setEliminatedChoiceIds] = useState<string[]>(["D"]);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"question" | "scratchpad">("question");
  const [instantRationale, setInstantRationale] = useState<boolean>(true);

  const toggleEliminate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEliminatedChoiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (selectedChoiceId === id) {
      setSelectedChoiceId(null);
    }
  };

  const handleSelectChoice = (choice: Choice) => {
    if (eliminatedChoiceIds.includes(choice.id)) return;
    setSelectedChoiceId(choice.id);
  };

  const handleReset = () => {
    setSelectedChoiceId(null);
    setEliminatedChoiceIds([]);
    setIsFlagged(false);
    setActiveTab("question");
  };

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-slate-700/50 bg-slate-900 text-slate-100 shadow-2xl shadow-brand-950/40 overflow-hidden ring-1 ring-white/10">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Simulator Window Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Live Simulator Preview
          </span>
        </div>

        {/* Continuous Timer Mockup */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/50 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>03:09:42</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            Single Continuous Timer
          </span>
        </div>
      </div>

      {/* Simulator Sub-Navbar / Tools */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/90 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            Item {SAMPLE_QUESTION.questionNumber} of {SAMPLE_QUESTION.totalQuestions}
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400 text-[11px] truncate max-w-[190px] sm:max-w-none">
            {SAMPLE_QUESTION.subtest}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "question" ? "scratchpad" : "question")}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
              activeTab === "scratchpad"
                ? "bg-brand-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            title="Toggle Arithmetic Scratchpad"
          >
            <Pencil className="w-3 h-3" />
            <span>Scratchpad</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFlagged(!isFlagged)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
              isFlagged
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
            title="Flag question for review"
          >
            <Flag className="w-3 h-3" />
            <span>{isFlagged ? "Flagged" : "Flag"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Body */}
      <div className="p-4 sm:p-5 text-left relative z-10">
        {activeTab === "scratchpad" ? (
          /* Scratchpad Simulation Tab */
          <div className="space-y-3 py-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-gold-400 flex items-center gap-1">
                <Pencil className="w-3.5 h-3.5" />
                Virtual Scratchpad (Physical Calculators Prohibited)
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("question")}
                className="text-[11px] text-brand-400 hover:underline"
              >
                Return to Item &rarr;
              </button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-2">
              <p className="text-slate-500"># Pacing equation for 170 items across 190 minutes:</p>
              <p className="text-emerald-400">190 min / 170 items = 1.117 min = 67.05 seconds/item</p>
              <p className="text-slate-400">Phase 1: First pass on high-confidence questions (~40s each)</p>
              <p className="text-slate-400">Phase 2: Numerical word problems & reasoning (~80s each)</p>
              <p className="text-amber-400 font-semibold">&gt; Status: On target pace for 85%+ score</p>
            </div>
          </div>
        ) : (
          /* Question & Choice Interactive Flow */
          <div className="space-y-4">
            {/* Question Text */}
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
              {SAMPLE_QUESTION.prompt}
            </p>

            {/* Choices Grid */}
            <div className="space-y-2">
              {SAMPLE_QUESTION.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isEliminated = eliminatedChoiceIds.includes(choice.id);

                return (
                  <div
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none text-xs sm:text-sm ${
                      isEliminated
                        ? "bg-slate-950/40 border-slate-800/60 opacity-40"
                        : isSelected
                        ? choice.isCorrect
                          ? "bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-sm"
                          : "bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-sm"
                        : "bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 mr-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                          isEliminated
                            ? "bg-slate-800 text-slate-600"
                            : isSelected
                            ? choice.isCorrect
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                            : "bg-slate-700 text-slate-300 group-hover:bg-slate-600"
                        }`}
                      >
                        {choice.label}
                      </span>
                      <span className={isEliminated ? "line-through text-slate-500" : ""}>
                        {choice.text}
                      </span>
                    </div>

                    {/* Strikethrough / Eliminate Distractor Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleEliminate(choice.id, e)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition opacity-80 hover:opacity-100 ${
                        isEliminated
                          ? "bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700"
                          : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                      title={isEliminated ? "Restore Choice" : "Cross out distractor"}
                    >
                      {isEliminated ? "Restore" : "Eliminate"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Instant Educational Rationale Expansion */}
            {instantRationale && selectedChoiceId && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-200/90 animate-fadeIn space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant Rationale • Official Legal Basis</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/70 font-mono">RA 6713 §5(a)</span>
                </div>
                <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">
                  {SAMPLE_QUESTION.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simulator Footer / Controls */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={instantRationale}
              onChange={(e) => setInstantRationale(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-gold-400" />
              Instant Rationale Mode
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
}
