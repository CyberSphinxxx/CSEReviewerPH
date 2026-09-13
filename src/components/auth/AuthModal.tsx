"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LocalStorageService } from "@/lib/storage";
import { AuthForm, AuthMode } from "./AuthForm";
import {
  X,
  CloudUpload,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "sign-in",
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sync state after successful auth
  const [authComplete, setAuthComplete] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAuthComplete(false);
      setSyncResult(null);
    }
  }, [isOpen, initialMode]);

  // Save and restore previous focus, trap focus, and handle escape
  useEffect(() => {
    if (!isOpen) return;

    // Store element that had focus before opening modal
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first input
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstInput = modalRef.current.querySelector<HTMLElement>(
          "input:not([disabled]), button:not([disabled])"
        );
        firstInput?.focus();
      }
    }, 50);

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleAuthSuccess = () => {
    // Check if there are local guest attempts to sync
    const guestHistory = LocalStorageService.getAttemptHistory();
    const guestBookmarks = LocalStorageService.getBookmarks();
    if (guestHistory.length === 0 && guestBookmarks.length === 0) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setAuthComplete(true);
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !syncing) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={authComplete ? "sync-modal-title" : "auth-form-title"}
        className="w-[calc(100vw-32px)] max-w-[520px] rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.24)] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 relative my-auto overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Post-auth Guest Data Sync Screen */}
        {authComplete ? (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <CloudUpload className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h2 id="sync-modal-title" className="text-xl font-bold tracking-tight">
                Sync Offline Progress
              </h2>
            </div>

            <div className="rounded-xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-900/60 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-200">
                    Signed In Successfully!
                  </h3>
                  <p className="text-xs text-brand-700 dark:text-brand-300">
                    We detected offline study progress on this device.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-brand-100 dark:border-brand-900/50">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {guestExamsCount}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Practice Exams</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-brand-100 dark:border-brand-900/50">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {guestBookmarksCount}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Bookmarks</div>
                </div>
              </div>
            </div>

            {syncResult && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-3 text-xs text-emerald-800 dark:text-emerald-300 font-medium text-center">
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
                disabled={syncing}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Skip for Now
              </button>
            </div>
          </div>
        ) : (
          <AuthForm
            mode={mode}
            onModeChange={(newMode) => setMode(newMode)}
            onSuccess={handleAuthSuccess}
            onGuestContinue={onClose}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
