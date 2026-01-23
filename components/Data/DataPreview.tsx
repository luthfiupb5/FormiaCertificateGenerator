'use client';

import { useState } from 'react';
import { Table, LayoutList, Check, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

interface DataPreviewProps {
    headers: string[];
    rows: any[];
    mappedColumns: Record<string, boolean>; // key: column name, value: is mapped
    onClose: () => void;
}

export default function DataPreview({ headers, rows, mappedColumns, onClose }: DataPreviewProps) {
    const [activeTab, setActiveTab] = useState<'preview' | 'mapping'>('preview');

    return (
        <div className="glass-panel w-full border-t border-border bg-[#0f0f0f]/90 flex flex-col h-72 animate-in slide-in-from-bottom duration-300 z-30 absolute bottom-0 left-0">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                        <Table className="w-4 h-4" />
                        {rows.length} records loaded
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={clsx(
                                "px-3 py-1 text-xs rounded-full transition-colors",
                                activeTab === 'preview' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"
                            )}
                        >
                            Data Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('mapping')}
                            className={clsx(
                                "px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-2",
                                activeTab === 'mapping' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"
                            )}
                        >
                            Mapping Status
                            {!headers.every(h => mappedColumns[h]) ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            ) : (
                                <Check className="w-3 h-3 text-green-500" />
                            )}
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-0">
                {activeTab === 'preview' && (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="sticky top-0 bg-[#1a1a1a] z-10 text-xs uppercase text-neutral-500 font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-3 border-b border-white/5 w-16 text-center">#</th>
                                {headers.map(h => (
                                    <th key={h} className="px-6 py-3 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            {h}
                                            {mappedColumns[h] && <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Mapped" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-300">
                            {rows.slice(0, 100).map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-2.5 text-center text-neutral-600 font-mono text-xs">{i + 1}</td>
                                    {headers.map(h => (
                                        <td key={h} className="px-6 py-2.5 truncate max-w-[200px]">
                                            {row[h]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'mapping' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {headers.map(h => (
                            <div key={h} className="p-3 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between">
                                <span className="text-sm text-white font-medium">{h}</span>
                                {mappedColumns[h] ? (
                                    <span className="text-xs flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                        <Check className="w-3 h-3" /> Mapped
                                    </span>
                                ) : (
                                    <span className="text-xs flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                        <AlertTriangle className="w-3 h-3" /> Unmapped
                                    </span>
                                )}
                            </div>
                        ))}
                        <div className="col-span-full mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-bold mb-1">How mapping works</p>
                                <p className="opacity-80">Select a text box on the canvas, then type the column name exactly as it appears here (e.g. <b>{headers[0]}</b>) into the "Mapped Column" field.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
