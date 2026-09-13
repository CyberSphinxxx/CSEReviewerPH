import React from "react";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import type { CscRegionalOffice } from "@/lib/exam-guide/types";
import { getSafeExternalLinkProps } from "@/lib/exam-guide/csc-domain";

interface RegionalOfficeDirectoryProps {
  offices: CscRegionalOffice[];
}

export function RegionalOfficeDirectory({ offices }: RegionalOfficeDirectoryProps) {
  return (
    <section id="regional-offices" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Field Operations Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CSC Regional Office Directory (16 Regions)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Verified addresses, hotlines, and official regional web pages directly from the CSC directory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {offices.map((office) => {
          return (
            <div
              key={office.code}
              id={`office-${office.code}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {office.shortName}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {office.name}
                    </h3>
                  </div>

                  <a
                    {...getSafeExternalLinkProps(office.officialPageUrl)}
                    className="text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1 shrink-0"
                    aria-label={`Visit official page for ${office.name}`}
                  >
                    <span>Regional Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Application System Assignment */}
                {office.applicationPortal && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Application System:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {office.applicationPortal.name}
                    </p>
                    {office.applicationPortal.warning && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300">
                        {office.applicationPortal.warning}
                      </p>
                    )}
                  </div>
                )}

                {/* Contact Directory Details */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {office.contactDetails?.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{office.contactDetails.address}</span>
                    </div>
                  )}

                  {office.contactDetails?.telephone && office.contactDetails.telephone.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        {office.contactDetails.telephone.join(" / ")}
                      </span>
                    </div>
                  )}

                  {office.contactDetails?.email && office.contactDetails.email.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        {office.contactDetails.email.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Domain: csc.gov.ph</span>
                <span>Verified: {office.lastVerifiedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
