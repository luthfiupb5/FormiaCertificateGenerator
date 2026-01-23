'use client';

import { useState, useMemo, useEffect } from 'react';
import { Type, Download, Loader2, MousePointer2, Database, Table, CheckCircle2, Undo, Redo } from 'lucide-react';
import dynamic from 'next/dynamic';
const KonvaStage = dynamic(() => import('../Canvas/KonvaStage'), { ssr: false });
import DataUploader from '../Data/DataUploader';
import DataPreview from '../Data/DataPreview';
import { generateCertificates } from '@/lib/generator';
import { GOOGLE_FONTS } from '@/lib/fonts';
import clsx from 'clsx';
import { useCanvasStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

interface WorkspaceProps {
    templateUrl: string;
    originalFileName: string;
}

export default function Workspace({ templateUrl, originalFileName }: WorkspaceProps) {
    const [isProcessing, setIsProcessing] = useState(false);

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

        // Center text on stage - could use current stage center but hardcoded is fine for MVP
        // In a real app we'd calculate center of visible viewport from store.stage

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

    const handleExport = async () => {
        if (!templateUrl || dataRows.length === 0) {
            alert('Please upload a template and data first.');
            return;
        }

        setIsProcessing(true);
        try {
            // Note: We need to adapt the generator to accept Nodes instead of Fabric Objects
            // For now passing "nodes" structure which is cleaner
            await generateCertificates({
                templateUrl,
                data: dataRows,
                mappings: {}, // Deprecated in favor of direct object mapping
                objects: nodes.map(n => ({
                    ...n,
                    // Generator expects specific properties, ensure compatibility
                    left: n.x,
                    top: n.y,
                    type: n.type === 'text' ? 'textbox' : n.type // Map types if needed
                })),
                canvasWidth: 800, // Should come from stage real dims
                canvasHeight: 600
            });
            alert('Certificates generated successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to generate certificates.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full animate-in fade-in duration-500 relative flex">

            <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">
                <div className="flex bg-neutral-800/80 backdrop-blur rounded-lg p-1 mr-2 border border-white/10">
                    <button
                        onClick={undo}
                        disabled={past.length === 0}
                        className="p-2 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-white/10 my-1 mx-1" />
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className="p-2 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={() => dataRows.length > 0 ? setShowDataPreview(!showDataPreview) : setShowDataUploader(true)}
                    className={clsx(
                        "btn btn-secondary text-sm gap-2 transition-all",
                        dataRows.length > 0 ? "border-green-500/50 text-green-500 hover:bg-green-500/10" : ""
                    )}
                >
                    {dataRows.length > 0 ? <Table className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                    {dataRows.length > 0 ? `${dataRows.length} Rows` : "Upload Data"}
                </button>
                <button
                    onClick={handleExport}
                    disabled={isProcessing}
                    className="btn btn-primary gap-2 px-6 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isProcessing ? 'Generating...' : 'Export'}</span>
                </button>
            </div>

            {/* LEFT SIDEBAR: Tools & Data Fields */}
            <div className="absolute top-6 left-6 flex flex-col gap-4 z-10 h-[calc(100%-3rem)] pointer-events-none">
                <div className="glass-panel p-1.5 rounded-xl flex flex-col gap-1 pointer-events-auto shadow-2xl shadow-black/50 w-14 items-center animate-in slide-in-from-left-4 fade-in duration-500">
                    <button
                        onClick={() => {
                            selectNode(null);
                            setActiveTool('select');
                        }}
                        className={clsx(
                            "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                            activeTool === 'select' && !selectedNode ? "bg-primary text-white shadow-lg shadow-primary/25" : "hover:bg-white/10 text-neutral-400 hover:text-white"
                        )}
                        title="Select Tool"
                    >
                        <MousePointer2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => addText()}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Add Text"
                    >
                        <Type className="w-5 h-5" />
                    </button>
                </div>

                {dataHeaders.length > 0 && (
                    <div className="glass-panel rounded-xl overflow-hidden pointer-events-auto shadow-2xl shadow-black/50 w-64 flex flex-col animate-in slide-in-from-left-4 fade-in duration-500 delay-100 max-h-[60vh]">
                        <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                                <Database className="w-3 h-3" /> Data Fields
                            </h3>
                        </div>
                        <div className="p-2 overflow-y-auto flex-1 space-y-1 custom-scrollbar">
                            {dataHeaders.map(header => (
                                <button
                                    key={header}
                                    onClick={() => addText(header)}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group",
                                        mappedColumns[header]
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "hover:bg-white/10 text-neutral-300 border border-transparent"
                                    )}
                                >
                                    <span className="truncate">{header}</span>
                                    {mappedColumns[header] && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                    {!mappedColumns[header] && <span className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-500">+ Add</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Canvas Area (Replaced) */}
            <KonvaStage templateUrl={templateUrl} />

            {/* Right Properties Panel */}
            {selectedNode && selectedNode.type === 'text' && (
                <div className="absolute top-6 right-6 w-72 glass-panel rounded-xl p-0 animate-in slide-in-from-right-10 fade-in duration-300 z-10 overflow-hidden shadow-2xl shadow-black/50">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                            Text Properties
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500">Font Family</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm outline-none focus:border-primary appearance-none"
                                value={selectedNode.fontFamily}
                                onChange={(e) => updateProperty('fontFamily', e.target.value)}
                            >
                                {GOOGLE_FONTS.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                                <option value="Arial">System: Arial</option>
                                <option value="Times New Roman">System: Times New Roman</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-500">Size</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm outline-none focus:border-primary"
                                    value={selectedNode.fontSize}
                                    onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-500">Color</label>
                                <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded px-2 py-1.5">
                                    <input
                                        type="color"
                                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-none p-0"
                                        value={selectedNode.fill}
                                        onChange={(e) => updateProperty('fill', e.target.value)}
                                    />
                                    <span className="text-xs text-neutral-400 truncate opacity-50 font-mono">{selectedNode.fill}</span>
                                </div>
                            </div>
                        </div>

                        {/* Alignment Controls */}
                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500">Alignment</label>
                            <div className="flex bg-black/20 border border-white/10 rounded p-1 gap-1">
                                {['left', 'center', 'right', 'justify'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateProperty('align', align)}
                                        className={clsx(
                                            "flex-1 p-1 rounded text-xs capitalize transition-colors",
                                            selectedNode.align === align ? "bg-white/20 text-white" : "text-neutral-500 hover:text-white"
                                        )}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-2" />
                        <div className="space-y-1 relative group">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-primary font-medium flex items-center gap-1.5">
                                    <Database className="w-3 h-3" /> Mapped Column
                                </label>
                                {dataHeaders.length > 0 && <span className="text-[10px] text-neutral-500 bg-white/5 px-1.5 rounded text-xs">{dataHeaders.length} available</span>}
                            </div>
                            {dataHeaders.length > 0 ? (
                                <select
                                    className="w-full bg-primary/10 border border-primary/20 rounded px-2 py-1.5 text-sm outline-none focus:border-primary text-primary appearance-none cursor-pointer"
                                    value={selectedNode.mappedColumn || ''}
                                    onChange={(e) => updateProperty('mappedColumn', e.target.value)}
                                >
                                    <option value="">-- Select Column --</option>
                                    {dataHeaders.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="e.g. Name"
                                    className="w-full bg-primary/10 border border-primary/20 rounded px-2 py-1.5 text-sm outline-none focus:border-primary text-primary placeholder:text-primary/30"
                                    defaultValue={selectedNode.mappedColumn || ''}
                                    onBlur={(e) => updateProperty('mappedColumn', e.target.value)}
                                />
                            )}
                            {dataHeaders.length === 0 && (
                                <p className="text-[10px] text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Upload data to see dropdown</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Data Preview */}
            {showDataPreview && (
                <DataPreview
                    headers={dataHeaders}
                    rows={dataRows}
                    mappedColumns={mappedColumns}
                    onClose={() => setShowDataPreview(false)}
                />
            )}

            {/* Modals */}
            {showDataUploader && (
                <DataUploader
                    onDataLoaded={handleDataLoaded}
                    onClose={() => setShowDataUploader(false)}
                />
            )}
        </div>
    );
}
