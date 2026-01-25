'use client';

import { useState } from 'react';
import { Download, FileImage, FileText, X, Layers, Files } from 'lucide-react';
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
}

export default function ExportModal({ onClose, onConfirm, isProcessing }: ExportModalProps) {
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [structure, setStructure] = useState<ExportStructure>('individual');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Download className="w-5 h-5 text-primary" />
                        Export Certificates
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Format</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat('pdf')}
                                className={clsx(
                                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                                    format === 'pdf'
                                        ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10"
                                        : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <FileText className={clsx("w-8 h-8", format === 'pdf' ? "text-primary" : "text-neutral-500")} />
                                <span className="font-medium">PDF Document</span>
                            </button>
                            <button
                                onClick={() => setFormat('jpg')}
                                className={clsx(
                                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                                    format === 'jpg'
                                        ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10"
                                        : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <FileImage className={clsx("w-8 h-8", format === 'jpg' ? "text-primary" : "text-neutral-500")} />
                                <span className="font-medium">JPG Images</span>
                            </button>
                        </div>
                    </div>

                    {/* Structure Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Structure</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setStructure('merged')}
                                // Merged JPG doesn't really make sense typicaly, usually request is for PDF
                                // but we can technically stitch images? For now let's allow it or disable if JPG?
                                // Usually "Merged JPG" is just a long vertical image, which is rarely wanted for certificates.
                                // Let's disable Merged for JPG for now to keep it simple, or treat "Merged" as "Single PDF" only.
                                disabled={format === 'jpg'}
                                className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                    structure === 'merged' && format !== 'jpg'
                                        ? "bg-primary/10 border-primary/50 text-white"
                                        : format === 'jpg'
                                            ? "opacity-50 cursor-not-allowed bg-white/5 border-transparent text-neutral-500"
                                            : "bg-white/5 border-transparent text-neutral-400 hover:bg-white/10"
                                )}
                            >
                                <Layers className="w-5 h-5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Single File</span>
                                    <span className="text-[10px] opacity-70">All certificates in 1 file</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setStructure('individual')}
                                className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                    structure === 'individual' || format === 'jpg'
                                        ? "bg-primary/10 border-primary/50 text-white"
                                        : "bg-white/5 border-transparent text-neutral-400 hover:bg-white/10"
                                )}
                            >
                                <Files className="w-5 h-5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">ZIP Archive</span>
                                    <span className="text-[10px] opacity-70">Separate file per person</span>
                                </div>
                            </button>
                        </div>
                        {format === 'jpg' && (
                            <p className="text-[10px] text-yellow-500/80 flex items-center gap-1.5 mt-2">
                                <span>Note:</span> JPG exports are always generated as a ZIP of individual images.
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 lg:flex lg:justify-end gap-3 bg-neutral-900/50">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="btn btn-ghost text-sm w-full lg:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm({ format, structure })}
                        disabled={isProcessing}
                        className="btn btn-primary text-sm w-full lg:w-auto gap-2"
                    >
                        {isProcessing ? (
                            <>Processing...</>
                        ) : (
                            <>Export {format.toUpperCase()}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
