"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Pen, Eraser, RotateCcw, X, Type, Edit3 } from "lucide-react";

interface ExamScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

function get2DContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  try {
    return canvas.getContext("2d");
  } catch {
    return null;
  }
}

export function ExamScratchpad({
  isOpen,
  onClose,
  notes,
  onNotesChange,
}: ExamScratchpadProps) {
  const [activeTab, setActiveTab] = useState<"draw" | "notes">("draw");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [penColor, setPenColor] = useState<string>("#1e293b"); // slate-800
  const lineWidth = 2.5;

  // Cached canvas image data so drawing persists across opens/closes
  const savedCanvasDataRef = useRef<string | null>(null);

  // Restore canvas when opening or switching to draw tab
  useEffect(() => {
    if (!isOpen || activeTab !== "draw") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = get2DContext(canvas);
    if (!ctx) return;

    // Set canvas dimensions based on container width
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      if (canvas.width !== Math.floor(rect.width) || canvas.height !== 380) {
        canvas.width = Math.floor(rect.width);
        canvas.height = 380;
      }
    }

    if (savedCanvasDataRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedCanvasDataRef.current;
    }
  }, [isOpen, activeTab]);

  const saveCanvas = useCallback(() => {
    if (canvasRef.current) {
      try {
        savedCanvasDataRef.current = canvasRef.current.toDataURL();
      } catch {
        // toDataURL may be unavailable in some environments
      }
    }
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = get2DContext(canvas);
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = tool === "eraser" ? 18 : lineWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : penColor;
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = get2DContext(canvas);
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvas();
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = get2DContext(canvas);
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    savedCanvasDataRef.current = null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
                <Edit3 className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Scratchpad &amp; Arithmetic Canvas
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                Calculators Prohibited in CSE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Use this virtual scratch paper for long division, fractions, and scratch arithmetic.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            aria-label="Close Scratchpad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Controls Toolbar */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("draw")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeTab === "draw"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
              <span>Sketch &amp; Write</span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeTab === "notes"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Type Notes</span>
            </button>
          </div>

          {activeTab === "draw" && (
            <div className="flex items-center gap-2">
              {/* Tool switch */}
              <button
                onClick={() => setTool("pen")}
                className={`p-1.5 rounded-lg border transition ${
                  tool === "pen"
                    ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                title="Pen"
              >
                <Pen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool("eraser")}
                className={`p-1.5 rounded-lg border transition ${
                  tool === "eraser"
                    ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>

              {/* Color pickers */}
              {tool === "pen" && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPenColor("#1e293b")}
                    className={`w-3.5 h-3.5 rounded-full bg-slate-800 ${
                      penColor === "#1e293b" ? "ring-2 ring-brand-500 ring-offset-1" : ""
                    }`}
                    title="Dark Charcoal"
                  />
                  <button
                    onClick={() => setPenColor("#0284c7")}
                    className={`w-3.5 h-3.5 rounded-full bg-sky-600 ${
                      penColor === "#0284c7" ? "ring-2 ring-brand-500 ring-offset-1" : ""
                    }`}
                    title="Blue Pen"
                  />
                  <button
                    onClick={() => setPenColor("#e11d48")}
                    className={`w-3.5 h-3.5 rounded-full bg-rose-600 ${
                      penColor === "#e11d48" ? "ring-2 ring-brand-500 ring-offset-1" : ""
                    }`}
                    title="Red Pen"
                  />
                </div>
              )}

              {/* Clear */}
              <button
                onClick={handleClearCanvas}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 transition shadow-sm font-medium"
                title="Clear sketchpad"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-hidden">
          {activeTab === "draw" ? (
            <div className="w-full h-[380px] bg-white rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden cursor-crosshair touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block bg-white"
              />
            </div>
          ) : (
            <div className="w-full h-[380px] flex flex-col">
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Type calculations or thoughts here (e.g., 170 items * 0.80 = 136 to pass; Speed = Distance / Time)..."
                className="w-full flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-mono leading-relaxed resize-none text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Notes persist throughout your current exam session.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-[10px] text-slate-700">S</kbd> to toggle Scratchpad</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl transition shadow-sm"
          >
            Keep Working
          </button>
        </div>
      </div>
    </div>
  );
}
