'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Table, Sparkles, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useCanvasStore } from '@/lib/store';

interface RowCarouselBarProps {
  dataRows: any[];
  dataHeaders: string[];
  onOpenDataPreview: () => void;
  onFitScreen?: () => void;
}

export default function RowCarouselBar({ dataRows, dataHeaders, onOpenDataPreview, onFitScreen }: RowCarouselBarProps) {
  const { activeRowIndex, setActiveRowIndex, stage, setStage } = useCanvasStore();

  const currentRow = dataRows[activeRowIndex] || {};
  const sampleText = currentRow[dataHeaders[0]] || currentRow[Object.keys(currentRow)[0]] || 'Record';

  const handlePrev = () => {
    setActiveRowIndex(activeRowIndex > 0 ? activeRowIndex - 1 : dataRows.length - 1);
  };

  const handleNext = () => {
    setActiveRowIndex(activeRowIndex < dataRows.length - 1 ? activeRowIndex + 1 : 0);
  };

  const handleZoom = (factor: number) => {
    const newScale = Math.max(0.3, Math.min(3, stage.scale * factor));
    setStage({ ...stage, scale: newScale });
  };

  const handleResetZoom = () => {
    if (onFitScreen) {
      onFitScreen();
    } else {
      setStage({ scale: 1, x: 0, y: 0 });
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 animate-in slide-in-from-bottom-6 duration-300">
      {/* ── DATASET ROW CAROUSEL ── */}
      {dataRows.length > 0 && (
        <div className="flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-xl px-4 py-2 rounded-full border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase font-mono">Live Data</span>
          </div>

          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Previous Row"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              #{activeRowIndex + 1} / {dataRows.length}
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[160px]" title={String(sampleText)}>
              {String(sampleText)}
            </span>
          </div>

          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Next Row"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDataPreview}
            className="ml-2 pl-2 border-l border-slate-800 text-[11px] font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            title="View Data Table"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      )}

      {/* ── ZOOM & STAGE FIT CONTROLS ── */}
      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-slate-200 shadow-lg text-slate-700">
        <button
          onClick={() => handleZoom(0.85)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetZoom}
          className="px-2 py-0.5 text-[11px] font-mono font-bold hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Reset Zoom"
        >
          {Math.round(stage.scale * 100)}%
        </button>

        <button
          onClick={() => handleZoom(1.15)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200 my-auto mx-1" />

        <button
          onClick={onFitScreen}
          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold transition-all flex items-center gap-1"
          title="Fit Canvas to Screen"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Fit Screen</span>
        </button>
      </div>
    </div>
  );
}
