'use client';

import { useState } from 'react';
import { Download, FileImage, FileText, X, Layers, Files, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export type ExportFormat = 'pdf' | 'jpg';
export type ExportStructure = 'individual' | 'merged';

export interface ExportConfig {
    format: ExportFormat;
    structure: ExportStructure;
}

interface ExportModalProps {
    onClose: () => void;
    onConfirm: (config: ExportConfig) => void;
    isProcessing: boolean;
    progress?: number;
}

export default function ExportModal({ onClose, onConfirm, isProcessing, progress = 0 }: ExportModalProps) {
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [structure, setStructure] = useState<ExportStructure>('individual');

    const isComplete = progress >= 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* ── MODE 1: PROCESSING POPUP PROGRESS VIEW ── */}
                {isProcessing ? (
                    <div className="p-8 text-center space-y-6">
                        {/* Icon Header */}
                        <div className="flex justify-center">
                            {isComplete ? (
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center relative">
                                    <Sparkles className="w-8 h-8 animate-pulse" />
                                    <Loader2 className="w-16 h-16 absolute inset-0 text-indigo-600 animate-spin opacity-25" />
                                </div>
                            )}
                        </div>

                        {/* Heading & Subtitle */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isComplete ? "Export Complete!" : "Thank you! Your certificates are processing..."}
                            </h2>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                                {isComplete
                                    ? "Your high-resolution certificates have been generated and downloaded."
                                    : "Please wait a moment while we render your certificates in the background."}
                            </p>
                        </div>

                        {/* Progress Bar with Percentage Only (No Count) */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center px-1 text-xs font-mono font-bold text-slate-600">
                                <span>Generating...</span>
                                <span className="text-indigo-600 font-extrabold text-sm">{progress}%</span>
                            </div>

                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                <div
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-300 shadow-sm"
                                    style={{ width: `${Math.max(5, progress)}%` }}
                                />
                            </div>
                        </div>

                        {/* Action / Done Button */}
                        {isComplete && (
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md mt-4"
                            >
                                Done
                            </button>
                        )}
                    </div>
                ) : (
                    /* ── MODE 2: EXPORT CONFIGURATION SELECTION VIEW ── */
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-base font-bold flex items-center gap-2 text-slate-800 font-mono">
                                <Download className="w-4 h-4 text-indigo-600" />
                                Export Certificates
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Format Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Format</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setFormat('pdf')}
                                        className={clsx(
                                            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                            format === 'pdf'
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm font-bold"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                        )}
                                    >
                                        <FileText className={clsx("w-7 h-7", format === 'pdf' ? "text-indigo-600" : "text-slate-400")} />
                                        <span className="text-xs font-semibold">PDF Document</span>
                                    </button>
                                    <button
                                        onClick={() => setFormat('jpg')}
                                        className={clsx(
                                            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                            format === 'jpg'
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm font-bold"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                        )}
                                    >
                                        <FileImage className={clsx("w-7 h-7", format === 'jpg' ? "text-indigo-600" : "text-slate-400")} />
                                        <span className="text-xs font-semibold">JPG Images</span>
                                    </button>
                                </div>
                            </div>

                            {/* Structure Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Structure</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setStructure('merged')}
                                        disabled={format === 'jpg'}
                                        className={clsx(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            structure === 'merged' && format !== 'jpg'
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm font-bold"
                                                : format === 'jpg'
                                                    ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100 text-slate-400"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                        )}
                                    >
                                        <Layers className="w-5 h-5 shrink-0 text-indigo-600" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">Single File</span>
                                            <span className="text-[10px] text-slate-400">All in 1 file</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setStructure('individual')}
                                        className={clsx(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            structure === 'individual' || format === 'jpg'
                                                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm font-bold"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                        )}
                                    >
                                        <Files className="w-5 h-5 shrink-0 text-indigo-600" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">ZIP Archive</span>
                                            <span className="text-[10px] text-slate-400">Separate per person</span>
                                        </div>
                                    </button>
                                </div>
                                {format === 'jpg' && (
                                    <p className="text-[11px] text-amber-600 flex items-center gap-1.5 mt-2">
                                        <span>Note:</span> JPG exports are generated as a ZIP archive.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm({ format, structure })}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md"
                            >
                                Export Certificates
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
