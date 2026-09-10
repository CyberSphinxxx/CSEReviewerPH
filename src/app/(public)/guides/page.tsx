import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllStudyGuides } from "@/lib/content";
import { BookOpen, Clock, Tag, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Service Exam Study Guides — csereviewph.com",
  description:
    "Structured syllabus study guides for the Philippine Civil Service Exam (CSE-PPT). Detailed coverage of RA 6713, Philippine Constitution, Vocabulary, Paragraph Organization, and Math.",
};

export default function StudyGuidesCatalogPage() {
  const guides = getAllStudyGuides();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-brand-600" />
              <span>Syllabus-Aligned Educational Materials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Civil Service Subtest Study Guides
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Master the core principles, constitutional articles, math shortcuts, and grammar rules required to pass the Philippine Career Service Examination.
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <article
                key={guide.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                      {guide.subject}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug">
                    <Link href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Level: <strong className="text-slate-700">{guide.level}</strong>
                  </span>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 transition"
                  >
                    <span>Read Study Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <AdSenseBanner slotId="guides-catalog-bottom" />

          {/* Bottom Callout */}
          <div className="text-center pt-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-700 hover:underline"
            >
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Explore targeted question drills by topic in our Practice Directory &rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
