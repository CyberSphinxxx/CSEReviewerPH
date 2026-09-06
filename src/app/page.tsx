import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Award, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Banner / Trust Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold shadow-md shadow-brand-700/20">
              <Award className="h-6 w-6 text-gold-400" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                CSE<span className="text-brand-600">Reviewer</span>
                <span className="text-gold-600 ml-0.5">PH</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                Civil Service Exam
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              href="/exams/professional/quick"
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition"
            >
              Quick Test
            </Link>
            <Link
              href="/practice"
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition"
            >
              Topics
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700 transition"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-brand-50/30 to-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Built to match the real Civil Service PPT exam format</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Pass the Philippine Civil Service Exam with{" "}
              <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Professional and Subprofessional mock exams with genuine continuous timing, detailed concept
              explanations, mistake analytics, and zero copied or leaked content.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/exams/professional/full"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-700/25 hover:bg-brand-800 transition transform active:scale-95"
              >
                Start Full Pro Mock Exam (170 items)
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/exams/professional/quick"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-base border border-slate-300 shadow-sm hover:bg-slate-50 transition"
              >
                Take Quick 10-Question Test
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <Clock className="w-6 h-6 text-brand-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900">Real Continuous Timer</h3>
                <p className="text-xs text-slate-500 mt-1">3h10m Pro, 2h40m Subpro unhindered single countdown</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <BookOpen className="w-6 h-6 text-brand-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900">Concept Explanations</h3>
                <p className="text-xs text-slate-500 mt-1">Teaches the underlying grammar, math, and logic rules</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-brand-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900">Mistake Bank</h3>
                <p className="text-xs text-slate-500 mt-1">Practice and master questions you missed</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-gold-600 mb-2" />
                <h3 className="font-bold text-sm text-slate-900">100% Original Content</h3>
                <p className="text-xs text-slate-500 mt-1">Written fresh per official CSC scope & syllabus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Modes Section */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Choose Your Preparation Mode</h2>
            <p className="text-slate-600 mt-2">Whether you have 5 minutes or 3 hours, practice with purpose.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Test */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-blue-50 text-brand-700 text-xs font-bold rounded-full mb-3">
                  Daily Habit
                </div>
                <h3 className="text-xl font-bold text-slate-900">Quick Test</h3>
                <p className="text-sm text-slate-600 mt-2">
                  5–10 randomized questions with immediate results and educational explanations. Great for commutes and quick drills.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4" /> 10 Minutes &bull; 10 Items
                </div>
              </div>
              <Link
                href="/exams/professional/quick"
                className="mt-6 block text-center py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-800 font-semibold text-sm transition"
              >
                Launch Quick Test &rarr;
              </Link>
            </div>

            {/* Medium Test */}
            <div className="rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50/20 to-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold rounded-full mb-3">
                  Focused Review
                </div>
                <h3 className="text-xl font-bold text-slate-900">Medium Test</h3>
                <p className="text-sm text-slate-600 mt-2">
                  20–50 items across all subjects or a single chosen subtest. Perfect for weekend study sessions and topic assessments.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4" /> 30 Minutes &bull; 30 Items
                </div>
              </div>
              <Link
                href="/exams/professional/medium"
                className="mt-6 block text-center py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition"
              >
                Launch Medium Test &rarr;
              </Link>
            </div>

            {/* Full Mock Test */}
            <div className="rounded-2xl border-2 border-brand-700 bg-white p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-gold-400/20 rounded-full blur-xl" />
              <div>
                <div className="inline-block px-3 py-1 bg-gold-100 text-gold-800 text-xs font-bold rounded-full mb-3">
                  Exam Simulation
                </div>
                <h3 className="text-xl font-bold text-slate-900">Full Mock Exam</h3>
                <p className="text-sm text-slate-600 mt-2">
                  170 items (Professional) or 165 items (Subprofessional) with continuous single timer, question navigator, and review screen.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4" /> 3 Hours 10 Mins &bull; 170 Items
                </div>
              </div>
              <Link
                href="/exams/professional/full"
                className="mt-6 block text-center py-2.5 px-4 rounded-lg bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm transition"
              >
                Start Real Simulation &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Legal Disclosure */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            Civil Service Exam Reviewer Philippines (CSEReviewerPH)
          </p>
          <p>
            Disclaimer: This reviewer platform is independently developed and is not affiliated with, endorsed by, or operated by the Philippine Civil Service Commission (CSC). All review questions and educational explanations are independently authored.
          </p>
          <p className="text-slate-400">
            Compliant with the Philippine Data Privacy Act of 2012 (RA 10173).
          </p>
        </div>
      </footer>
    </div>
  );
}
