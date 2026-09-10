"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { Mail, MessageSquare, CheckCircle2, Clock, ShieldAlert, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "correction",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    // Client-side confirmation state
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>We Value Your Feedback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact & Editorial Support
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Have a question correction, technical bug report, or privacy inquiry? Reach out to our editorial and engineering team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Details Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Mail className="w-4 h-4 text-brand-700" />
                  Direct Channels
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase tracking-wider font-semibold">General & Support</span>
                    <a
                      href="mailto:support@csereviewph.com"
                      className="font-medium text-brand-700 hover:underline text-sm"
                    >
                      support@csereviewph.com
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-400 block uppercase tracking-wider font-semibold">Data Privacy Officer</span>
                    <a
                      href="mailto:privacy@csereviewph.com"
                      className="font-medium text-brand-700 hover:underline text-sm"
                    >
                      privacy@csereviewph.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-brand-700" />
                  Response Window
                </div>
                <p>
                  We aim to review editorial submissions, question feedback, and bug reports within 24–48 hours (Philippine Standard Time, UTC+8).
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>No official CSC exam leaks or requests entertained.</span>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <MessageSquare className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-bold text-slate-900">Send an Inquiry</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-bold text-slate-700 mb-1"
                        >
                          Your Name / Alias
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g. Maria Santos"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-bold text-slate-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-category"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                      >
                        <option value="correction">Question Correction / Typo Report</option>
                        <option value="technical">Technical Bug / Timer Issue</option>
                        <option value="privacy">RA 10173 Data Privacy Request</option>
                        <option value="content">Content Suggestion / Subtest Request</option>
                        <option value="other">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Message Details
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Please include question numbers or relevant details if reporting an issue..."
                        className="w-full text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white text-sm font-bold shadow-md hover:bg-brand-800 transition"
                    >
                      <Send className="w-4 h-4" />
                      Submit Message
                    </button>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                        Thank you for helping us improve csereviewph.com. Our editorial and support team will review your message promptly.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", category: "correction", message: "" });
                      }}
                      className="inline-block text-xs font-bold text-brand-700 hover:underline pt-2"
                    >
                      Send another message &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AdSenseBanner slotId="contact-page-bottom" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
