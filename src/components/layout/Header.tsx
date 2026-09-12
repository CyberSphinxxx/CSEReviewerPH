"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import { UserNav } from "@/components/auth/UserNav";

export function Header() {
  const { data: session } = useSession();
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    try {
      const history = LocalStorageService.getAttemptHistory();
      const bookmarks = LocalStorageService.getBookmarks();
      const mistakes = LocalStorageService.getMistakeBank();
      if (history.length > 0 || bookmarks.length > 0 || mistakes.length > 0) {
        setHasProgress(true);
      }
    } catch {
      // LocalStorage unavailable in private mode or SSR
    }
  }, []);

  const showProgress = Boolean(session?.user || hasProgress);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" prefetch={true} className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold shadow-md shadow-brand-700/20 group-hover:bg-brand-800 transition">
            <Award className="h-6 w-6 text-gold-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              csereview<span className="text-brand-600">ph</span>
              <span className="text-gold-600 font-semibold ml-0.5 text-base">.com</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">
              Civil Service Exam
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-3">
          <Link
            href="/practice"
            prefetch={true}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition"
          >
            Practice
          </Link>
          <Link
            href="/guides"
            prefetch={true}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition"
          >
            Study Guides
          </Link>
          <Link
            href="/#how-it-works"
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition"
          >
            How It Works
          </Link>
          <Link
            href="/faq"
            prefetch={true}
            className="hidden sm:inline-block px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition"
          >
            FAQ
          </Link>

          {showProgress && (
            <Link
              href="/dashboard"
              prefetch={true}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-brand-700 transition"
            >
              My Progress
            </Link>
          )}

          <UserNav />
        </nav>
      </div>
    </header>
  );
}
