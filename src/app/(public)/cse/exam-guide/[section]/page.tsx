import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExamGuideView } from "@/components/exam-guide/ExamGuideView";

const VALID_SECTIONS = [
  "schedule",
  "testing-centers",
  "how-to-apply",
  "requirements",
  "exam-day",
  "results",
  "official-links",
] as const;

type SectionSlug = (typeof VALID_SECTIONS)[number];

const SECTION_METADATA: Record<
  SectionSlug,
  { title: string; description: string }
> = {
  schedule: {
    title: "CSE Exam Schedule & Calendar (2027 & Historical) — csereviewph.com",
    description: "View verified examination dates, filing opening periods, and target passer release dates for the Philippine Civil Service Exam.",
  },
  "testing-centers": {
    title: "Civil Service Exam Testing Centers by Region — csereviewph.com",
    description: "Search and filter CSE-PPT testing center localities across all 16 CSC regions, including amendment history and updates.",
  },
  "how-to-apply": {
    title: "How to Apply for the Civil Service Exam (12 Steps) — csereviewph.com",
    description: "Step-by-step guide to filing your CSE-PPT application, selecting your CSC regional office, and scheduling personal appearance.",
  },
  requirements: {
    title: "CSE Application & Documentary Requirements Checklist — csereviewph.com",
    description: "Complete list of required forms (CS Form 100), ID criteria, passport photos with name tag specifications, and statutory eligibility.",
  },
  "exam-day": {
    title: "CSE Exam-Day Protocols & What to Bring Checklist — csereviewph.com",
    description: "Essential rules for exam day: strict 7:45 AM gate closure, mandatory IDs, black ballpens, permitted items, and prohibited gadgets.",
  },
  results: {
    title: "CSE Results, Rating Verification & Certification — csereviewph.com",
    description: "How to check official passer lists on csc.gov.ph, generate your OCSERGS rating, and claim your Certificate of Eligibility.",
  },
  "official-links": {
    title: "Official CSC Links & Regional Portal Directory — csereviewph.com",
    description: "Verified directory of official Civil Service Commission websites, OCSEAS application portals, eServe, and eNOSA systems.",
  },
};

export function generateStaticParams() {
  return VALID_SECTIONS.map((section) => ({
    section,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const section = resolved.section as SectionSlug;

  if (!VALID_SECTIONS.includes(section)) {
    return {
      title: "CSE Exam Guide — csereviewph.com",
    };
  }

  const meta = SECTION_METADATA[section];
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function ExamGuideSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const resolved = await params;
  const section = resolved.section as SectionSlug;

  if (!VALID_SECTIONS.includes(section)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ExamGuideView initialSection={section} />
      </main>

      <Footer />
    </div>
  );
}
