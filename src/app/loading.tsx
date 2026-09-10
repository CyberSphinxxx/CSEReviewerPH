import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6 animate-pulse">
      {/* Brand Icon Spinner Skeleton */}
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-700/15 flex items-center justify-center border border-brand-200">
          <div className="w-8 h-8 rounded-xl bg-brand-600 animate-spin" style={{ animationDuration: "1.5s" }} />
        </div>
      </div>

      {/* Text Skeleton */}
      <div className="flex flex-col items-center space-y-2">
        <div className="h-4 w-40 bg-slate-200 rounded-full" />
        <div className="h-3 w-28 bg-slate-100 rounded-full" />
      </div>

      {/* Content Skeleton Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-5/6 bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}
