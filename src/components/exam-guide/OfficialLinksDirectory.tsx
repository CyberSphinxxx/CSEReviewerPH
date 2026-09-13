import React from "react";
import {
  ExternalLink,
  Lock,
  Globe,
} from "lucide-react";
import type { OfficialLinkItem } from "@/lib/exam-guide/types";
import {
  getSafeExternalLinkProps,
  CSC_LOGIN_SECURITY_DISCLAIMER,
} from "@/lib/exam-guide/csc-domain";

interface OfficialLinksDirectoryProps {
  links: OfficialLinkItem[];
}

export function OfficialLinksDirectory({ links }: OfficialLinksDirectoryProps) {
  const generalLinks = links.filter((l) => l.category === "general");
  const appLinks = links.filter((l) => l.category === "application");
  const assignmentLinks = links.filter((l) => l.category === "assignment");
  const careerLinks = links.filter((l) => l.category === "careers");

  return (
    <section id="official-links" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Verified External Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Official CSC Links Directory
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Strictly verified allowlisted government domains on the <code>csc.gov.ph</code> network.
        </p>
      </div>

      {/* Security Guidance Helper */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official CSC Portal Security:</strong> {CSC_LOGIN_SECURITY_DISCLAIMER}
        </p>
      </div>

      {/* 1. Application Systems */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Online Application & Appointment Systems
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>

      {/* 2. School Assignment & Results */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          School Assignment & Verification Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignmentLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>

      {/* 3. General CSC Resources & Career Opportunities */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          General CSC Announcements & Government Careers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...generalLinks, ...careerLinks].map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LinkCard({ link }: { link: OfficialLinkItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-300 dark:hover:border-brand-700 transition">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {link.domainBadge}
          </span>
          {link.regionScope && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {link.regionScope}
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          {link.label}
        </h4>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {link.description}
        </p>

        {link.warning && (
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
            <strong>Notice:</strong> {link.warning}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <a
          {...getSafeExternalLinkProps(link.url)}
          className="inline-flex items-center justify-between w-full text-xs font-bold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200 group"
        >
          <span>Open Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </a>
      </div>
    </div>
  );
}
