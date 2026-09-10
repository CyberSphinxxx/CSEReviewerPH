"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { FAQS } from "@/lib/content";
import { HelpCircle, ChevronDown, ChevronUp, Search, ArrowRight } from "lucide-react";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("eligibility-qualifications");

  const categories = [
    "All",
    "Qualifications & Eligibility",
    "Exam Format & Scoring",
    "Exam Day Guidelines",
    "Preparation & Review",
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Schema.org FAQPage JSON-LD for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Schema.org FAQPage metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 animate-page-enter">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
              <span>Everything You Need to Know</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Civil Service Exam Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Clear, verified answers to common questions about CSE eligibility requirements, passing grades, exam day rules, and preparation strategies.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ by keyword (e.g. passing grade, calculator, valid ID, retake)..."
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-brand-700 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                      aria-expanded={isOpen}
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 block mb-1">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="text-slate-400 shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-brand-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* AdSense Placement */}
          <AdSenseBanner slotId="faq-page-bottom" />

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">Ready to test your readiness?</h3>
              <p className="text-xs text-brand-100">
                Put your knowledge into practice with our 100% original full mock exam.
              </p>
            </div>
            <Link
              href="/exams/professional/full"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-900 text-xs font-bold hover:bg-brand-50 transition shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>Take Full Mock Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
