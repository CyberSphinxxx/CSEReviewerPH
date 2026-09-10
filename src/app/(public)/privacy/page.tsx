import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { Shield, Lock, Eye, FileText, Database, UserCheck, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — csereviewph.com",
  description:
    "Privacy Policy of csereviewph.com compliant with Republic Act No. 10173 (Philippine Data Privacy Act of 2012) and Google AdSense Third-Party Advertising policies.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 9, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Title Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>RA 10173 & Google Publisher Policy Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy & Data Notice
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Last updated: {lastUpdated} &bull; Effective immediately
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-5 h-5 text-brand-600" />
                1. Overview & Commitment to Data Privacy
              </h2>
              <p>
                <strong>csereviewph.com</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;) is committed to protecting the privacy and personal data of examinees in full compliance with the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, its Implementing Rules and Regulations (IRR), and relevant National Privacy Commission (NPC) issuances.
              </p>
              <p>
                This Privacy Policy explains what information is collected when you access our Civil Service Examination preparation platform, how it is used, your rights as a Data Subject, and our disclosures regarding third-party advertising partners including Google AdSense.
              </p>
            </section>

            {/* Section 2: Google AdSense & Cookies */}
            <section className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-600" />
                2. Third-Party Advertising & Google AdSense Disclosures
              </h2>
              <p>
                To provide free, high-quality civil service review materials to all Filipinos without mandatory subscription fees, we partner with third-party vendors, including <strong>Google</strong>, to serve advertisements when you visit our website.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li>
                  <strong>Google Advertising Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
                </li>
                <li>
                  <strong>DoubleClick / DART Cookie:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our platform and/or other sites across the World Wide Web.
                </li>
                <li>
                  <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings at{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline font-medium"
                  >
                    https://www.google.com/settings/ads
                  </a>{" "}
                  or alternatively by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline font-medium"
                  >
                    www.aboutads.info
                  </a>
                  .
                </li>
                <li>
                  <strong>Distraction-Free Examinations:</strong> In strict compliance with our platform design principles, advertisements are <em>strictly prohibited</em> within active timed examination rooms, over exam questions, over multiple-choice options, or near examination navigation controls.
                </li>
              </ul>
            </section>

            {/* Section 3: Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Database className="w-5 h-5 text-brand-600" />
                3. Information We Collect
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900">A. Guest Practice & Browser Local Storage (Offline-First)</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    By default, csereviewph.com does not require you to create an account or provide identifying personal information to practice. Your test attempts, question bookmarks, study streak, and Mistake Bank entries are stored locally on your device in your browser&apos;s <code>localStorage</code>. This data never leaves your device unless you choose to export it.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">B. Registered Account Data (When Enabled)</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    If you choose to register an account, we may collect your email address, display name, and authentication identifiers through Better Auth. We collect only what is strictly necessary to save your multi-device progress.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">C. System & Diagnostic Logs</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    We collect aggregated, anonymized technical telemetry (browser type, device screen resolution, page loading latency, error reports via Sentry) to fix bugs and optimize mobile responsiveness.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Rights of Data Subjects under RA 10173 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <UserCheck className="w-5 h-5 text-brand-600" />
                4. Your Rights Under the Philippine Data Privacy Act
              </h2>
              <p>
                Under Section 16 of Republic Act No. 10173, examinees and users possess the following statutory rights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Right to be Informed</span>
                  You have the right to know whether personal data pertaining to you is being processed.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Right to Access & Portability</span>
                  You can inspect your data or download a full JSON copy using our 1-click &ldquo;Export Backup&rdquo; button in the Dashboard.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Right to Erasure or Blocking</span>
                  You can permanently delete all your stored history and local records using the &ldquo;Reset All Data&rdquo; feature at any time.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Right to Object & Rectification</span>
                  You have the right to opt out of advertising cookies or request correction of erroneous data.
                </div>
              </div>
            </section>

            {/* Section 5: Data Retention & Security */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="w-5 h-5 text-brand-600" />
                5. Data Security & Storage Controls
              </h2>
              <p>
                We implement industry-standard cryptographic and architectural measures to safeguard data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li>End-to-end transport encryption via HTTPS / TLS 1.3 across all routes.</li>
                <li>Strict Content Security Policy (CSP) and HTTP security headers (HSTS, nosniff, frame-ancestors).</li>
                <li>No automated selling, renting, or unauthorized trading of examinee data with third-party brokers.</li>
              </ul>
            </section>

            {/* Section 6: Contact & DPO */}
            <section className="space-y-3 bg-brand-50/50 p-5 rounded-xl border border-brand-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-brand-700" />
                6. Contact Our Data Protection Officer (DPO)
              </h2>
              <p className="text-xs text-slate-600">
                For inquiries, privacy complaints, or requests to exercise your data subject rights under RA 10173, please contact our designated Data Protection Officer:
              </p>
              <div className="text-xs text-slate-700 space-y-1 pt-1 font-mono">
                <p><strong>Entity:</strong> csereviewph.com Data Privacy Team</p>
                <p><strong>Email:</strong> privacy@csereviewph.com</p>
                <p><strong>Jurisdiction:</strong> Republic of the Philippines (National Privacy Commission compliance)</p>
              </div>
            </section>
          </div>

          <AdSenseBanner slotId="privacy-page-bottom" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
