"use client";

import React, { useState } from "react";
import { signIn, signUp } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state after successful auth
  const [authComplete, setAuthComplete] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }

        const res = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
        });

        if (res.error) {
          setError(res.error.message || "Failed to create account. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        const res = await signIn.email({
          email: email.trim(),
          password,
        });

        if (res.error) {
          setError(res.error.message || "Invalid email or password.");
          setLoading(false);
          return;
        }
      }

      setAuthComplete(true);
      setLoading(false);

      // Check if there are local guest attempts to sync
      const guestHistory = LocalStorageService.getAttemptHistory();
      const guestBookmarks = LocalStorageService.getBookmarks();
      if (guestHistory.length === 0 && guestBookmarks.length === 0) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleSyncGuestData = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await LocalStorageService.syncGuestDataToCloud();
      if (res.success) {
        setSyncResult(
          `Successfully migrated ${res.synced?.attempts ?? 0} exams and ${res.synced?.bookmarks ?? 0} bookmarks to your account!`
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setSyncResult(`Sync note: ${res.error || "Completed with warnings."}`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      }
    } catch {
      setSyncResult("Sync failed. You can re-sync anytime from your dashboard.");
    } finally {
      setSyncing(false);
    }
  };

  const guestExamsCount = LocalStorageService.getAttemptHistory().length;
  const guestBookmarksCount = LocalStorageService.getBookmarks().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {authComplete ? (
              <>
                <CloudUpload className="h-5 w-5 text-brand-600" />
                Sync Offline Progress
              </>
            ) : isSignUp ? (
              "Create Reviewer Account"
            ) : (
              "Sign In to Sync Progress"
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sync Step (if auth completed and guest data found) */}
        {authComplete ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-900">Signed In Successfully!</h3>
                  <p className="text-xs text-brand-700">
                    We detected offline study progress on this device.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white rounded-lg p-2 border border-brand-100">
                  <div className="text-lg font-bold text-slate-900">{guestExamsCount}</div>
                  <div className="text-slate-500">Practice Exams</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-brand-100">
                  <div className="text-lg font-bold text-slate-900">{guestBookmarksCount}</div>
                  <div className="text-slate-500">Bookmarks</div>
                </div>
              </div>
            </div>

            {syncResult && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium text-center">
                {syncResult}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSyncGuestData}
                disabled={syncing}
                className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" />
                    Sync to Cloud Now
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Skip for Now
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@example.ph"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : isSignUp ? (
                "Create Account & Sync"
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-xs text-slate-500">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                    }}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to CSE Reviewer?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError(null);
                    }}
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    Create free account
                  </button>
                </>
              )}
            </div>

            {/* RA 10173 Compliance Note */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Data Privacy (RA 10173):</span>{" "}
                Creating an account is 100% optional. We only collect your email to preserve your
                study history across devices. You may export or permanently delete your records at
                any time.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
