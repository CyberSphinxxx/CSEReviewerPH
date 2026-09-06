import Link from "next/link";
import { getAllExamLevels } from "@/features/practice/practice-service";
import { BookOpen, ChevronRight, Award } from "lucide-react";

export const metadata = {
  title: "Practice by Topic — Philippine Civil Service Exam Reviewer",
  description: "Targeted practice by subtest and topic for CSE Professional and Subprofessional.",
};

export default function PracticeTopicsPage() {
  const levels = getAllExamLevels();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Targeted Skill Drills</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Practice by Topic
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-2xl">
            Focus on specific subtests and subject areas to build confidence and master underlying rules.
          </p>
        </div>

        {/* Level Accordions / Sections */}
        {levels.map((level) => (
          <div key={level.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{level.name}</h2>
                <p className="text-xs text-slate-500">{level.description}</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {level.subjects.map((sub) => (
                <div key={sub.id} className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800">
                    {sub.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sub.topics.map((top) => (
                      <Link
                        key={top.id}
                        href={`/practice/${top.id}`}
                        className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition flex items-center justify-between group"
                      >
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 group-hover:text-brand-700 transition">
                            {top.name}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {top.questionCount} {top.questionCount === 1 ? "question" : "questions"} available
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
