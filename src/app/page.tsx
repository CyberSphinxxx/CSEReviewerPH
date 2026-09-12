"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Award,
  AlertTriangle,
  BrainCircuit,
  Compass,
  FileCheck2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { HeroDiagnosticPlanPreview } from "@/components/home/HeroDiagnosticPlanPreview";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState<"professional" | "subprofessional">("professional");

  // Calculate days remaining to March 21, 2027 CSE-PPT Cycle 1
  const targetDate = new Date(2027, 2, 21); // March 21, 2027
  const now = new Date();
  const diffDays = Math.max(1, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-brand-100 selection:text-brand-900">
      <Header />

      <main className="flex-1 animate-page-enter">
        {/* ========================================================================= */}
        {/* HERO SECTION: Single Clear Promise, Outcome Preview, Quiet Countdown     */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-brand-50/20 to-slate-50">
          {/* Subtle Atmospheric Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Hero Copy, Primary & Secondary CTAs, Trust Points (7 cols) */}
              <div className="lg:col-span-7 text-left space-y-5">
                {/* Quiet Utility Countdown Detail */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  <span>Next CSE-PPT: March 21, 2027 &bull; {diffDays} days remaining</span>
                </div>

                {/* Small Category Label */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
                    PHILIPPINE CIVIL SERVICE EXAM REVIEWER
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Know what to study next.
                </h1>

                {/* Short Support Sentence */}
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Take a free 10-question diagnostic and get a clear view of your strongest and weakest CSE subtests.
                </p>

                {/* Primary & Secondary Call to Actions */}
                <div className="pt-2 flex flex-wrap gap-3.5 items-center">
                  <Link
                    href={`/exams/${selectedLevel}/quick`}
                    prefetch={true}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm sm:text-base shadow-sm hover:bg-slate-800 transition transform active:scale-95"
                  >
                    <span>Start Free Diagnostic</span>
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition"
                  >
                    <span>How It Works</span>
                  </a>
                </div>

                {/* Three Short Trust Points */}
                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    No sign-up required
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Professional &amp; Subprofessional
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Original questions
                  </span>
                </div>
              </div>

              {/* Right Column: Static Outcome Preview Visual (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <HeroDiagnosticPlanPreview level={selectedLevel} />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS & LEARNING LOOP SECTION (Anchored by #how-it-works)         */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-16 md:py-20 bg-white border-b border-slate-200 scroll-mt-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                The Product Loop
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                How It Works: From Diagnostic to Exam Readiness
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                A structured 4-step loop designed around active recall, diagnostic gap closure, and real examination time management.
              </p>
            </div>

            {/* 4-Step Learning Cycle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
                    Step 1
                  </span>
                  <Clock className="w-4 h-4 text-brand-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">1. Practice Immediately</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start with a 10-question diagnostic with zero sign-up friction. Answers auto-save locally to your browser.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
                    Step 2
                  </span>
                  <Target className="w-4 h-4 text-brand-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">2. Diagnose Gaps</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive instant subtest accuracy breakdowns benchmarked against the official 80.00% passing threshold.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    Step 3
                  </span>
                  <BrainCircuit className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">3. Review Mistakes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every incorrect response enters your Leitner Spaced Repetition mistake bank for targeted concept re-testing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    Step 4
                  </span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">4. Measure Readiness</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track confidence scores, drill high-yield topics, and graduate to full-length continuous simulation mocks.
                </p>
              </div>
            </div>

            {/* The Real Practice Interface Overview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Authentic Examination Engine
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    How the Exam Runner Works
                  </h3>
                </div>
                <Link
                  href="/practice"
                  prefetch={true}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  <span>Explore All Practice Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                Unlike informal quiz apps, our test engine enforces genuine examination fidelity: <strong>single continuous timers</strong> (3h 10m Pro / 2h 40m Subpro), question navigation drawers, flag-for-review tags, choice eliminators, and comprehensive pedagogical explanations revealed only after completing your test.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                  <FileCheck2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Zero Scraped Questions</span>
                    <span className="text-slate-500 text-[11px]">Authored fresh by educators; no leaked or pirated materials.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Single Continuous Timer</span>
                    <span className="text-slate-500 text-[11px]">Trains stamina and pacing across the full 170/165 items.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                  <Compass className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Offline PWA Resumption</span>
                    <span className="text-slate-500 text-[11px]">Interrupted sessions resume seamlessly from local storage.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PREPARATION MODES & LEVEL SWITCHER SECTION                                */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Exam Formats &bull; Select Your Level
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Choose Your Preparation Mode
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Select your Civil Service Examination category to configure official item counts and timer allotments.
            </p>

            {/* Level Switcher Widget */}
            <div className="pt-3 inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 gap-1 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setSelectedLevel("professional")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLevel === "professional"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Professional (170 items &bull; 3h 10m)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("subprofessional")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLevel === "subprofessional"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Subprofessional (165 items &bull; 2h 40m)
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedLevel === "professional"
                ? "Includes Analytical Ability (Logic, Syllogisms, Data Sufficiency). Required for 2nd Level government positions."
                : "Includes Clerical Ability (Alphabetizing, Office Filing Procedures). Required for 1st Level clerical positions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Test */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Daily Pacing Drill
                </span>
                <h3 className="text-xl font-bold text-slate-900">Quick Test</h3>
                <p className="text-sm text-slate-600 mt-2">
                  10 randomized questions with immediate diagnostic score and concept explanations. Ideal for daily lunch breaks or commutes.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" /> 10 Minutes &bull; 10 Items
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/quick`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs"
              >
                Launch Quick Test &rarr;
              </Link>
            </div>

            {/* Medium Test */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-2">
                  Targeted Subtest Review
                </span>
                <h3 className="text-xl font-bold text-slate-900">Medium Test</h3>
                <p className="text-sm text-slate-600 mt-2">
                  30 items across all subjects or a single chosen subtest. Perfect for weekend study sessions and targeted topic assessments.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" /> 30 Minutes &bull; 30 Items
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/medium`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition shadow-xs"
              >
                Launch Medium Test &rarr;
              </Link>
            </div>

            {/* Full Mock Test */}
            <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-gold-400/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 block mb-2">
                  Real Exam Simulation
                </span>
                <h3 className="text-xl font-bold text-slate-900">Full Mock Exam</h3>
                <p className="text-sm text-slate-600 mt-2">
                  170 items (Professional) or 165 items (Subprofessional) with continuous single timer, question navigator, and review screen.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-gold-600" />
                  {selectedLevel === "professional" ? "3 Hours 10 Mins • 170 Items" : "2 Hours 40 Mins • 165 Items"}
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/full`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs"
              >
                Start Real Simulation &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DIAGNOSTIC PACING INSIGHT: "The 67-Second Reality"                        */}
        {/* ========================================================================= */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-10 shadow-xs">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  CSC Time Management Analysis
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Overcoming the 67-Second Reality: How to Pass the CSE-PPT
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Official Civil Service Commission (CSC) statistical releases confirm historical passing rates hover between 14% and 18%. Over 80% of examinees fail not because questions are impossible, but because they run out of time on the unhindered <strong>170-item continuous timer</strong> (190 minutes Pro / 160 minutes Subpro)—averaging just <strong>67 seconds per item</strong>.
                </p>
              </div>

              {/* Comparison Visual Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pitfall Card */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>The Fatal Mistake (What most do)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Spending 3–4 minutes struggling on difficult numerical problems or complex logic puzzles, causing examinees to run out of time and blindly guess on the final 30–40 easy General Information items.
                  </p>
                  <div className="pt-2 text-[11px] font-bold text-rose-700">
                    &times; Result: Automatic failure due to subtest passing cutoffs
                  </div>
                </div>

                {/* The Continuous Timing Method */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>The Continuous Timing Method (How to Pass)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Train on genuine unhindered single countdowns. Answer rapid-fire vocabulary and constitutional law in ~35s, flag tricky questions, and preserve a 45-minute buffer for numerical word problems.
                  </p>
                  <div className="pt-2 text-[11px] font-bold text-emerald-700">
                    &check; Result: 100% item completion &amp; 80.00%+ benchmark mastery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE SUBTEST & SYLLABUS EXPLORER                                  */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Civil Service Commission Scope
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Explore Subtests &amp; High-Yield Syllabi
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                Select a subtest below to inspect its item distribution, passing pacing rules, and high-yield topics.
              </p>
            </div>

            <SubtestExplorer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STUDY GUIDES & STRATEGY ARTICLES SHOWCASE                                */}
        {/* ========================================================================= */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Educational Syllabus
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  High-Yield Study Guides &amp; Strategy
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Master the official syllabus rules, constitutional articles, and pacing formulas.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/guides"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
                >
                  <span>All Study Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-300">&bull;</span>
                <Link
                  href="/articles"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
                >
                  <span>Strategy Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-300">&bull;</span>
                <Link
                  href="/faq"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
                >
                  <span>Exam FAQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guides & Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: RA 6713 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-100">
                    General Information
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    <Link href="/guides/ra-6713-code-of-conduct" prefetch={true} className="hover:text-brand-700 transition">
                      RA 6713: The 8 Norms of Conduct &amp; Ethical Standards
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Essential public servant obligations, prohibited gifts, conflict of interest rules, and annual SALN filing deadlines.
                  </p>
                </div>
                <Link
                  href="/guides/ra-6713-code-of-conduct"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                >
                  Read Study Guide &rarr;
                </Link>
              </div>

              {/* Card 2: 67-Second Rule */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                    Exam Strategy
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    <Link href="/articles/continuous-timer-pacing-strategy" prefetch={true} className="hover:text-brand-700 transition">
                      The 67-Second Rule: Continuous Timer Pacing Strategy
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    How to allocate your 190 minutes across four phases so you never run out of time on the 170-item CSE-PPT.
                  </p>
                </div>
                <Link
                  href="/articles/continuous-timer-pacing-strategy"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                >
                  Read Article &rarr;
                </Link>
              </div>

              {/* Card 3: 1987 Constitution */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                    Constitutional Law
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    <Link href="/guides/philippine-constitution-essentials" prefetch={true} className="hover:text-brand-700 transition">
                      1987 Philippine Constitution: High-Yield Provisions
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Article III Bill of Rights, Citizenship, and the mandates of the 3 Independent Constitutional Commissions.
                  </p>
                </div>
                <Link
                  href="/guides/philippine-constitution-essentials"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                >
                  Read Study Guide &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AdSenseBanner slotId="homepage-bottom" />

      <Footer />
    </div>
  );
}
