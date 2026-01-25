'use client';

import { useState, useMemo, useEffect } from 'react';
import { Type, Download, Loader2, MousePointer2, Database, Table, CheckCircle2, Undo, Redo, Trash2, Save, ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
const KonvaStage = dynamic(() => import('../Canvas/KonvaStage'), { ssr: false });
import DataUploader from '../Data/DataUploader';
import DataPreview from '../Data/DataPreview';
import { generateCertificates } from '@/lib/generator';
import { GOOGLE_FONTS } from '@/lib/fonts';
import clsx from 'clsx';
import { useCanvasStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import ExportModal, { ExportConfig } from './ExportModal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface WorkspaceProps {
    templateUrl: string;
    originalFileName: string;
}

export default function Workspace({ templateUrl, originalFileName }: WorkspaceProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // Global Store
    const {
        nodes,
        addNode,
        updateNode,
        selectedNodeId,
        selectNode,
        activeTool,
        setActiveTool,
        undo,
        redo,
        past,
        future,
        removeNode
    } = useCanvasStore();

    // Derived State
    const selectedNode = useMemo(() =>
        nodes.find(n => n.id === selectedNodeId),
        [nodes, selectedNodeId]);

    // Data State
    const [showDataUploader, setShowDataUploader] = useState(false);
    const [dataHeaders, setDataHeaders] = useState<string[]>([]);
    const [dataRows, setDataRows] = useState<any[]>([]);
    const [showDataPreview, setShowDataPreview] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    // Computed Mapping State
    const mappedColumns = useMemo(() => {
        const mappingStatus: Record<string, boolean> = {};
        dataHeaders.forEach(h => mappingStatus[h] = false);
        nodes.forEach((node) => {
            if (node.mappedColumn && dataHeaders.includes(node.mappedColumn)) {
                mappingStatus[node.mappedColumn] = true;
            }
        });
        return mappingStatus;
    }, [nodes, dataHeaders]);

    // Auto-prompt Data Upload
    useEffect(() => {
        const timer = setTimeout(() => setShowDataUploader(true), 600);
        return () => clearTimeout(timer);
    }, []);

    // Helper for keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId) {
                    // Prevent backspace from navigating back
                    e.preventDefault();
                    removeNode(selectedNodeId);
                    selectNode(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const addText = (mappedColumn: string = '') => {
        const textValue = mappedColumn ? `{${mappedColumn}}` : 'Double click to edit';
        const id = uuidv4();
        addNode({
            id,
            type: 'text',
            x: 400, // Reasonable default
            y: 300,
            text: textValue,
            fontSize: 40,
            fontFamily: 'Inter',
            fill: '#000000',
            width: 300,
            align: 'center',
            mappedColumn
        });
        selectNode(id);
        setActiveTool('select');
    };

    const updateProperty = (key: string, value: any) => {
        if (!selectedNodeId) return;
        updateNode(selectedNodeId, { [key]: value });
    };

    const handleDataLoaded = (headers: string[], rows: any[]) => {
        setDataHeaders(headers);
        setDataRows(rows);
        setShowDataUploader(false);
        setShowDataPreview(true);
    };

    const handleExportClick = () => {
        if (!templateUrl || dataRows.length === 0) {
            alert('Please upload a template and data first.');
            return;
        }
        setShowExportModal(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Please log in to save your project.');
                return;
            }
            const params = new URLSearchParams(window.location.search);
            const projectId = params.get('id') || uuidv4();

            const projectData = {
                id: projectId,
                user_id: user.id,
                name: originalFileName || 'Untitled Project',
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('projects').upsert(projectData).select();
            if (error) throw error;
            if (!params.get('id')) {
                window.history.pushState({}, '', `?id=${projectId}`);
            }
        } catch (e: any) {
            console.error('Save failed:', e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportConfirm = async (config: ExportConfig) => {
        setIsProcessing(true);
        try {
            await generateCertificates({
                templateUrl,
                data: dataRows,
                mappings: {},
                objects: nodes.map(n => ({
                    ...n,
                    left: n.x,
                    top: n.y,
                    type: n.type
                })),
                canvasWidth: nodes.find(n => n.id === 'background-template')?.width || 800,
                canvasHeight: nodes.find(n => n.id === 'background-template')?.height || 600,
                exportFormat: config.format,
                exportStructure: config.structure
            });
            alert('Certificates generated successfully!');
            setShowExportModal(false);
        } catch (e: any) {
            console.error(e);
            alert(`Failed to generate certificates: ${e.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full animate-in fade-in duration-500 relative flex pointer-events-none">

            {/* Top Floating Toolbar */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center pointer-events-auto">
                <div className="flex bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                    <button
                        onClick={undo}
                        disabled={past.length === 0}
                        className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-white/10 my-2 mx-1" />
                    <button
                        onClick={() => {
                            if (selectedNodeId) {
                                removeNode(selectedNodeId);
                                selectNode(null);
                            }
                        }}
                        disabled={!selectedNodeId}
                        className="p-2.5 rounded-xl hover:bg-red-500/10 text-neutral-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-white/10 my-2 mx-1" />

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-violet-400 disabled:opacity-30 transition-colors"
                        title="Save"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={() => dataRows.length > 0 ? setShowDataPreview(!showDataPreview) : setShowDataUploader(true)}
                        className={clsx(
                            "p-2.5 rounded-xl transition-all border border-transparent mx-1",
                            dataRows.length > 0
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "hover:bg-white/10 text-neutral-400 hover:text-white"
                        )}
                        title="Upload Data"
                    >
                        <Database className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleExportClick}
                        disabled={isProcessing}
                        className="ml-2 px-6 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Export"}
                    </button>
                </div>
            </div>

            {/* LEFT SIDEBAR: Tools & Data Fields */}
            <div className="absolute top-28 left-6 flex flex-col gap-4 z-10 h-[calc(100%-8rem)] w-64 pointer-events-none">
                {/* Tools */}
                <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-16 items-center animate-in slide-in-from-left-4 fade-in duration-500 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 ring-1 ring-white/5">
                    <button
                        onClick={() => {
                            selectNode(null);
                            setActiveTool('select');
                        }}
                        className={clsx(
                            "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200",
                            activeTool === 'select' && !selectedNode ? "bg-white text-black shadow-lg" : "hover:bg-white/10 text-neutral-500 hover:text-white"
                        )}
                        title="Select Tool"
                    >
                        <MousePointer2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            selectNode(null);
                            setActiveTool(activeTool === 'text' ? 'select' : 'text');
                        }}
                        className={clsx(
                            "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200",
                            activeTool === 'text' ? "bg-white text-black shadow-lg" : "hover:bg-white/10 text-neutral-500 hover:text-white"
                        )}
                        title="Draw Text Tool"
                    >
                        <Type className="w-5 h-5" />
                    </button>
                </div>

                {/* Data Fields Panel */}
                {dataHeaders.length > 0 && (
                    <div className="glass-panel rounded-2xl overflow-hidden pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full flex flex-col animate-in slide-in-from-left-4 fade-in duration-500 delay-100 max-h-[50vh] bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 ring-1 ring-white/5">
                        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <h3 className="text-[10px] font-bold font-heading uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                Data Fields
                            </h3>
                            <span className="text-[10px] text-neutral-600 bg-white/5 px-2 py-0.5 rounded-full">{dataRows.length} rows</span>
                        </div>
                        <div className="p-3 overflow-y-auto flex-1 space-y-1.5 custom-scrollbar">
                            {dataHeaders.map(header => (
                                <button
                                    key={header}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', `{${header}}`);
                                        e.dataTransfer.effectAllowed = 'copy';
                                    }}
                                    onClick={() => addText(header)}
                                    className={clsx(
                                        "w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-grab active:cursor-grabbing border",
                                        mappedColumns[header]
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-black/20 text-neutral-400 border-transparent hover:border-white/10 hover:text-white"
                                    )}
                                >
                                    <span className="truncate pointer-events-none tracking-wide">{header}</span>
                                    {mappedColumns[header] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 pointer-events-none" />}
                                    {!mappedColumns[header] && <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-neutral-500 pointer-events-none" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Canvas Area (Interactive) */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <KonvaStage templateUrl={templateUrl} />
            </div>

            {/* Right Properties Panel - PREMIUM DESIGN */}
            {selectedNode && selectedNode.type === 'text' && (
                <div className="absolute top-28 right-6 w-80 animate-in slide-in-from-right-10 fade-in duration-300 z-10 pointer-events-auto">
                    <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 ring-1 ring-white/5">
                        {/* Panel Header */}
                        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <h3 className="text-[10px] font-bold font-heading uppercase tracking-widest text-neutral-400">
                                Properties
                            </h3>
                            <button onClick={() => selectNode(null)} className="text-neutral-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 space-y-6">
                            {/* Font Family Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Typography</label>
                                <div className="relative group">
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 appearance-none text-white cursor-pointer hover:bg-black/60 transition-colors"
                                        value={selectedNode.fontFamily}
                                        onChange={(e) => updateProperty('fontFamily', e.target.value)}
                                        style={{ fontFamily: selectedNode.fontFamily }}
                                    >
                                        {GOOGLE_FONTS.map(font => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 group-hover:text-white transition-colors">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Size & Color */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Size</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500/50 text-white font-mono transition-colors"
                                            value={selectedNode.fontSize}
                                            onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-[10px] font-bold pointer-events-none">PX</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Color</label>
                                    <div className="w-full h-10 bg-black/40 border border-white/10 rounded-xl flex items-center px-2 gap-2 cursor-pointer hover:border-white/30 transition-colors relative overflow-hidden group">
                                        <input
                                            type="color"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            value={selectedNode.fill}
                                            onChange={(e) => updateProperty('fill', e.target.value)}
                                        />
                                        <div className="w-6 h-6 rounded-lg border border-white/10 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: selectedNode.fill }} />
                                        <span className="text-xs font-mono text-neutral-400 group-hover:text-white uppercase tracking-wider">{selectedNode.fill}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Alignment */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-wider">Align</label>
                                <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                                    {[
                                        { key: 'left', icon: AlignLeft },
                                        { key: 'center', icon: AlignCenter },
                                        { key: 'right', icon: AlignRight }
                                    ].map(({ key, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => updateProperty('align', key)}
                                            className={clsx(
                                                "flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all",
                                                selectedNode.align === key
                                                    ? "bg-white/10 text-white shadow-sm"
                                                    : "text-neutral-600 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Mapped Column */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase font-bold text-emerald-500/80 tracking-wider flex items-center gap-1.5">
                                        <Database className="w-3 h-3" /> Data Source
                                    </label>
                                </div>
                                {dataHeaders.length > 0 ? (
                                    <div className="relative group">
                                        <select
                                            className="w-full bg-emerald-900/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50 text-emerald-400 appearance-none cursor-pointer hover:bg-emerald-900/20 transition-colors"
                                            value={selectedNode.mappedColumn || ''}
                                            onChange={(e) => updateProperty('mappedColumn', e.target.value)}
                                        >
                                            <option value="">Static Text (No Data)</option>
                                            {dataHeaders.map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center gap-3 text-neutral-500 text-xs">
                                        <Database className="w-4 h-4 opacity-50" />
                                        <span>Link data to automate this text.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDataPreview && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <DataPreview
                        headers={dataHeaders}
                        rows={dataRows}
                        mappedColumns={mappedColumns}
                        onClose={() => setShowDataPreview(false)}
                    />
                </div>
            )}

            {showDataUploader && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <DataUploader
                        onDataLoaded={handleDataLoaded}
                        onClose={() => setShowDataUploader(false)}
                    />
                </div>
            )}

            {showExportModal && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <ExportModal
                        onClose={() => setShowExportModal(false)}
                        onConfirm={handleExportConfirm}
                        isProcessing={isProcessing}
                    />
                </div>
            )}
        </div>
    );
}
