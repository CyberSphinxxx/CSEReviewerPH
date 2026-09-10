import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllArticles } from "@/lib/content";
import { Newspaper, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Service Exam Strategy & Articles — csereviewph.com",
  description:
    "Expert tips, timing strategies, and educational insights to help Filipino examinees pass the Philippine Civil Service Examination.",
};

export default function ArticlesCatalogPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Newspaper className="w-3.5 h-3.5 text-brand-600" />
              <span>Strategy, Insights & Advice</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Civil Service Preparation Articles
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Proven timing frameworks, subtest comparisons, and tactical advice from educators to help you ace the CSE-PPT on your first attempt.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTimeMinutes} min</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {article.publishedDate}
                  </span>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <AdSenseBanner slotId="articles-catalog-bottom" />

          {/* CTA Box */}
          <div className="text-center pt-2">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-700 hover:underline"
            >
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Looking for subject reviews? Check out our complete Subtest Study Guides &rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
