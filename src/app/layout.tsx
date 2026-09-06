import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSE Reviewer PH — Civil Service Exam Reviewer Platform",
  description:
    "Comprehensive Philippine Civil Service Examination (CSE) preparation platform. Practice Professional & Subprofessional tests with real timing, detailed explanations, and progress tracking.",
  keywords: [
    "Civil Service Exam",
    "CSE Reviewer",
    "CSE Professional",
    "CSE Subprofessional",
    "Philippine Civil Service Commission",
    "Civil Service Mock Exam",
    "CSE Reviewer 2026",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
