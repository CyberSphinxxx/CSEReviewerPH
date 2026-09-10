import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <main className="flex-1 animate-page-enter">
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-brand-50/30 to-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Built to match the real Civil Service PPT exam format &bull; csereviewph.com</span>
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
                prefetch={true}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-700/25 hover:bg-brand-800 transition transform active:scale-95"
              >
                Start Full Pro Mock Exam (170 items)
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/exams/professional/quick"
                prefetch={true}
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
                prefetch={true}
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
                prefetch={true}
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
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-lg bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm transition"
              >
                Start Real Simulation &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Study Guides & Strategy Articles Showcase */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Comprehensive Learning Resources</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  High-Yield Study Guides & Strategy
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
                      RA 6713: The 8 Norms of Conduct & Ethical Standards
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
