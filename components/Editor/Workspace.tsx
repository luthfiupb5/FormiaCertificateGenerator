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
import SidebarPanel from './SidebarPanel';
import RowCarouselBar from './RowCarouselBar';
import PropertiesPanel from './PropertiesPanel';
import ExportModal, { ExportConfig } from './ExportModal';

interface WorkspaceProps {
    templateUrl: string;
    originalFileName: string;
    initialProjectName?: string;
    initialDataRows?: any[];
    initialDataHeaders?: string[];
}

export default function Workspace({ templateUrl: initialTemplateUrl, originalFileName, initialProjectName, initialDataRows, initialDataHeaders }: WorkspaceProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [projectName, setProjectName] = useState(initialProjectName || originalFileName || 'Untitled Project');
    const [currentTemplateUrl, setCurrentTemplateUrl] = useState<string>(initialTemplateUrl);

    // Global Store
    const {
        nodes,
        addNode,
        updateNode,
        selectedNodeId,
        selectedNodeIds,
        selectNode,
        activeTool,
        setActiveTool,
        undo,
        redo,
        past,
        future,
        removeNode,
        duplicateNode,
        moveNodeLayer,
        setStage,
    } = useCanvasStore();

    // Derived State
    const selectedNode = useMemo(() =>
        nodes.find(n => n.id === selectedNodeId),
        [nodes, selectedNodeId]);

    // Data State
    const [showDataUploader, setShowDataUploader] = useState(false);
    const [dataHeaders, setDataHeaders] = useState<string[]>(initialDataHeaders || []);
    const [dataRows, setDataRows] = useState<any[]>(initialDataRows || []);
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

    const handleFitScreen = () => {
        const bgNode = nodes.find(n => n.id === 'background-template');
        if (!bgNode || !bgNode.width || !bgNode.height) {
            setStage({ scale: 1, x: 0, y: 0 });
            return;
        }

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        const scaleX = (viewportW * 0.70) / bgNode.width;
        const scaleY = (viewportH * 0.70) / bgNode.height;
        const scale = Math.min(scaleX, scaleY, 1.2);

        const x = (viewportW - bgNode.width * scale) / 2;
        const y = (viewportH - bgNode.height * scale) / 2 - 20;

        setStage({ scale, x, y });
    };

    const handleSelectTemplatePreset = (url: string, name: string) => {
        setCurrentTemplateUrl(url);
        // Replace background node
        const bgNode = nodes.find(n => n.id === 'background-template');
        if (bgNode) {
            updateNode('background-template', { src: url });
        } else {
            addNode({
                id: 'background-template',
                type: 'image',
                x: 0,
                y: 0,
                src: url,
            });
        }
    };

    // Auto-save Effect
    useEffect(() => {
        if (!selectedNodeId && nodes.length > 0) {
            const timer = setTimeout(() => {
                handleSave();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [nodes, selectedNodeId]);

    // Helper for keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
                if (selectedNodeId || selectedNodeIds.length > 0) {
                    e.preventDefault();
                    const targets = selectedNodeIds.length > 0 ? selectedNodeIds : (selectedNodeId ? [selectedNodeId] : []);
                    targets.forEach(id => removeNode(id));
                    selectNode(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, selectedNodeId, selectedNodeIds]);

    const addText = (mappedColumn: string = '') => {
        const textValue = mappedColumn ? `{${mappedColumn}}` : 'Double click to edit';
        const id = uuidv4();
        addNode({
            id,
            type: 'text',
            x: 400,
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
        if (!currentTemplateUrl) {
            alert('Please select a template first.');
            return;
        }
        setShowExportModal(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const nodesToSave = nodes.filter(n => n.id !== 'background-template');

            const projectData = {
                name: projectName || 'Untitled Project',
                templateUrl: currentTemplateUrl,
                templateOriginalName: originalFileName,
                dataRows,
                dataHeaders,
                canvasNodes: nodesToSave,
                updatedAt: new Date().toISOString(),
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem('korae_current_project', JSON.stringify(projectData));
            }
        } catch (e: any) {
            console.error('Save to local cache failed:', e);
        } finally {
            setIsSaving(false);
        }
    };

    const [exportProgress, setExportProgress] = useState(0);

    const handleExportConfirm = async (config: ExportConfig) => {
        setIsProcessing(true);
        setExportProgress(5);
        try {
            await generateCertificates({
                templateUrl: currentTemplateUrl,
                data: dataRows.length > 0 ? dataRows : [{}],
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
                exportStructure: config.structure,
                onProgress: (pct) => {
                    setExportProgress(pct);
                }
            });
            setExportProgress(100);
        } catch (e: any) {
            console.error(e);
            alert(`Failed to generate certificates: ${e.message}`);
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full animate-in fade-in duration-500 relative flex pointer-events-none">

            {/* Top Floating Toolbar */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center pointer-events-auto">
                <div className="flex bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 border border-slate-200 shadow-xl ring-1 ring-slate-200/50">
                    <button
                        onClick={undo}
                        disabled={past.length === 0}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-slate-200 my-2 mx-1" />
                    <button
                        onClick={() => {
                            if (selectedNodeId) {
                                removeNode(selectedNodeId);
                                selectNode(null);
                            }
                        }}
                        disabled={!selectedNodeId && selectedNodeIds.length === 0}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Delete (Del)"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-slate-200 my-2 mx-1" />

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors"
                        title="Save Project"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Save className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={() => dataRows.length > 0 ? setShowDataPreview(!showDataPreview) : setShowDataUploader(true)}
                        className={clsx(
                            "p-2 rounded-xl transition-all border border-transparent mx-1 flex items-center gap-1.5 text-xs font-semibold",
                            dataRows.length > 0
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        )}
                        title="Upload Dataset"
                    >
                        <Database className="w-4 h-4" />
                        <span className="hidden md:inline">{dataRows.length > 0 ? `${dataRows.length} Rows` : 'Upload Data'}</span>
                    </button>

                    <button
                        onClick={handleExportClick}
                        disabled={isProcessing}
                        className="ml-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Export Certificates"}
                    </button>
                </div>
            </div>

            {/* LEFT SIDEBAR: Canva Style Sidebar Panel */}
            <div className="absolute top-20 left-6 z-20 h-[calc(100%-6.5rem)] pointer-events-none">
                <SidebarPanel
                    dataHeaders={dataHeaders}
                    dataRows={dataRows}
                    mappedColumns={mappedColumns}
                    onOpenDataUploader={() => setShowDataUploader(true)}
                    onSelectTemplatePreset={handleSelectTemplatePreset}
                />
            </div>

            {/* Canvas Area (Interactive Stage) */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <KonvaStage templateUrl={currentTemplateUrl} dataRows={dataRows} />
            </div>

            {/* Bottom Live Dataset Carousel & Fit Controls */}
            <RowCarouselBar
                dataRows={dataRows}
                dataHeaders={dataHeaders}
                onOpenDataPreview={() => setShowDataPreview(true)}
                onFitScreen={handleFitScreen}
            />

            {/* Right Properties Panel - Photoshop / Figma Style */}
            <PropertiesPanel dataHeaders={dataHeaders} />

            {showDataPreview && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <DataPreview
                        headers={dataHeaders}
                        rows={dataRows}
                        mappedColumns={mappedColumns}
                        onClose={() => setShowDataPreview(false)}
                    />
                </div>
            )}

            {showDataUploader && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <DataUploader
                        onDataLoaded={handleDataLoaded}
                        onClose={() => setShowDataUploader(false)}
                    />
                </div>
            )}

            {showExportModal && (
                <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <ExportModal
                        onClose={() => {
                            setShowExportModal(false);
                            setIsProcessing(false);
                            setExportProgress(0);
                        }}
                        onConfirm={handleExportConfirm}
                        isProcessing={isProcessing}
                        progress={exportProgress}
                    />
                </div>
            )}
        </div>
    );
}
