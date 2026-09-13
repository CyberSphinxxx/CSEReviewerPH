"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Brain, Scale, FolderArchive, ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface SubtestInfo {
  id: string;
  name: string;
  icon: typeof BookOpen;
  items: number;
  timeTarget: string;
  levels: "pro-subpro" | "pro-only" | "subpro-only";
  levelBadge: string;
  description: string;
  topics: string[];
  pacingStrategy: string;
  practiceHref: string;
}

const SUBTESTS: SubtestInfo[] = [
  {
    id: "verbal",
    name: "Verbal Ability",
    icon: BookOpen,
    items: 50,
    timeTarget: "~40 mins",
    levels: "pro-subpro",
    levelBadge: "Professional & Subprofessional",
    description:
      "Evaluates proficiency in English and Filipino vocabulary, grammar, sentence mechanics, paragraph organization, and reading comprehension.",
    topics: [
      "Vocabulary & Context Clues (English & Filipino)",
      "Grammar & Correct Usage (Subject-Verb Agreement, Tenses)",
      "Paragraph Organization & Coherence",
      "Reading Comprehension & Critical Analysis",
    ],
    pacingStrategy: "Answer straightforward vocabulary and grammar in ~35s each to preserve buffer for reading comprehension passages.",
    practiceHref: "/practice",
  },
  {
    id: "numerical",
    name: "Numerical Ability",
    icon: Calculator,
    items: 40,
    timeTarget: "~50 mins",
    levels: "pro-subpro",
    levelBadge: "Professional & Subprofessional",
    description:
      "Assesses fundamental arithmetic, percentage, ratio/proportion, basic algebraic equations, and complex word problems without physical calculators.",
    topics: [
      "Basic Mathematical Operations & Decimals",
      "Fractions, Percentages, and Ratios",
      "Number Series & Pattern Sequence Identification",
      "Multi-Step Word Problems (Work, Rate, Age, Investment)",
    ],
    pacingStrategy: "Physical calculators are strictly prohibited. Use manual arithmetic approximations and scratchpad setups to stay under 80s per word problem.",
    practiceHref: "/practice",
  },
  {
    id: "analytical",
    name: "Analytical Ability",
    icon: Brain,
    items: 30,
    timeTarget: "~35 mins",
    levels: "pro-only",
    levelBadge: "Professional Level Only",
    description:
      "Tests deductive logic, identifying assumptions, valid syllogistic conclusions, word analogies, and data sufficiency reasoning.",
    topics: [
      "Word Association, Synonyms & Antonyms",
      "Formal Logic, Syllogisms & Conditional Statements",
      "Assumption Identification & Conclusion Validity",
      "Data Sufficiency Evaluation",
    ],
    pacingStrategy: "Sketch quick truth tables or Venn diagrams for syllogisms; skip and flag heavily convoluted logic items on your first pass.",
    practiceHref: "/practice",
  },
  {
    id: "geninfo",
    name: "General Information",
    icon: Scale,
    items: 20,
    timeTarget: "~15 mins",
    levels: "pro-subpro",
    levelBadge: "Professional & Subprofessional",
    description:
      "Covers the 1987 Philippine Constitution, Republic Act No. 6713 (Code of Conduct), peace & human rights, and environmental protection.",
    topics: [
      "1987 Philippine Constitution (Bill of Rights, 3 Branches, Constitutional Commissions)",
      "RA 6713: Norms of Conduct, Prohibited Gifts & SALN Deadlines",
      "Human Rights Concepts & Democratic Principles",
      "Environmental Laws & Ecological Solid Waste Management",
    ],
    pacingStrategy: "High-yield recall questions. Aim for ~30s per item to complete all 20 questions in 10 minutes and bank time for math.",
    practiceHref: "/practice",
  },
  {
    id: "clerical",
    name: "Clerical Ability",
    icon: FolderArchive,
    items: 30,
    timeTarget: "~25 mins",
    levels: "subpro-only",
    levelBadge: "Subprofessional Level Only",
    description:
      "Evaluates procedural clerical accuracy, alphabetical indexing rules, filing management systems, and proofreading.",
    topics: [
      "Alphabetical Filing Rules & Standard Office Indexing",
      "Spelling, Capitalization & Punctuation Inspection",
      "Clerical Operations & Record-Keeping Procedures",
      "Data Verification & Coding Accuracy",
    ],
    pacingStrategy: "Inspect letter-by-letter surname sequences methodically. Avoid rushing to ensure zero transposition errors.",
    practiceHref: "/practice",
  },
];

export function SubtestExplorer() {
  const [activeTabId, setActiveTabId] = useState<string>("verbal");
  const activeSubtest = SUBTESTS.find((s) => s.id === activeTabId) || SUBTESTS[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Subtest Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SUBTESTS.map((subtest) => {
          const Icon = subtest.icon;
          const isActive = subtest.id === activeTabId;

          return (
            <button
              key={subtest.id}
              type="button"
              onClick={() => setActiveTabId(subtest.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-brand-700 text-white border-brand-700 shadow-md shadow-brand-700/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brand-600 dark:text-brand-400"}`} />
              <span>{subtest.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {subtest.items}Q
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Subtest Detail Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeSubtest.levels === "pro-only"
                    ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                    : activeSubtest.levels === "subpro-only"
                    ? "bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    : "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                }`}
              >
                {activeSubtest.levelBadge}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Target Pacing: {activeSubtest.timeTarget}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <activeSubtest.icon className="w-6 h-6 text-brand-700 dark:text-brand-400" />
              <span>{activeSubtest.name}</span>
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {activeSubtest.description}
            </p>
          </div>

          <Link
            href={activeSubtest.practiceHref}
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md shadow-brand-700/20 transition active:scale-95"
          >
            <span>Practice {activeSubtest.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Breakdown Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Topics Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              High-Yield Syllabus Topics
            </h4>
            <div className="space-y-2">
              {activeSubtest.topics.map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-normal">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timing & Pacing Advice */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Timing & Examination Strategy</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeSubtest.pacingStrategy}
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Official CSC Weight: {activeSubtest.items} items</span>
              <span className="font-semibold text-brand-700 dark:text-brand-400">Benchmark: 80.00% Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
