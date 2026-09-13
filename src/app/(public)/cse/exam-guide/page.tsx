import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExamGuideView } from "@/components/exam-guide/ExamGuideView";

export const metadata: Metadata = {
  title: "CSE Exam Schedule, Testing Centers and Official CSC Links — csereviewph.com",
  description:
    "View Civil Service Exam schedules, possible testing centers, application guidance, school-assignment tools, and verified links to official CSC services.",
  keywords: [
    "Civil Service Exam schedule",
    "CSE-PPT testing centers",
    "CSC OCSEAS portal",
    "eNOSA school assignment",
    "Civil Service application requirements",
    "March 2027 CSE",
    "August 2027 CSE",
    "CSC regional offices",
  ],
  openGraph: {
    title: "CSE Exam Schedule, Testing Centers and Official CSC Links",
    description:
      "Comprehensive Civil Service Examination guide with verified testing center localities, 2027 calendars, eNOSA school assignments, and official CSC resources.",
    url: "/cse/exam-guide",
    type: "website",
  },
};

export default function ExamGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ExamGuideView />
      </main>

      <Footer />
    </div>
  );
}
