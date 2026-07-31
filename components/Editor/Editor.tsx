'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Loader2, Plus } from 'lucide-react';
import NewProjectModal from '@/components/Dashboard/NewProjectModal';
import Workspace from './Workspace';
import { useCanvasStore } from '@/lib/store';

export default function Editor() {
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    const [initialDataRows, setInitialDataRows] = useState<any[]>([]);
    const [initialDataHeaders, setInitialDataHeaders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { loadNodes, clearNodes } = useCanvasStore();

    // Check localStorage for existing project on mount
    useEffect(() => {
        const loadSavedProject = () => {
            clearNodes();
            try {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('korae_current_project');
                    if (saved) {
                        const project = JSON.parse(saved);
                        if (project && project.templateUrl) {
                            setProjectName(project.name || 'Untitled Project');
                            setOriginalFileName(project.templateOriginalName || 'Template');
                            setTemplateUrl(project.templateUrl);
                            setInitialDataRows(project.dataRows || []);
                            setInitialDataHeaders(project.dataHeaders || []);

                            if (project.canvasNodes && Array.isArray(project.canvasNodes)) {
                                loadNodes(project.canvasNodes);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to restore project from local cache:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedProject();
    }, []);

    const handleProjectCreated = (data: any) => {
        setProjectName(data.name);
        setOriginalFileName(data.templateOriginalName);
        setInitialDataRows(data.dataRows || []);
        setInitialDataHeaders(data.dataHeaders || []);
        setTemplateUrl(data.templateUrl);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to start a new project? This will clear current unsaved changes in your local cache.')) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('korae_current_project');
            }
            clearNodes();
            setTemplateUrl(null);
            setOriginalFileName('');
            setProjectName('');
            setInitialDataRows([]);
            setInitialDataHeaders([]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex bg-slate-50 h-screen w-full items-center justify-center text-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
            {/* Floating Glass Header */}
            <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-14 rounded-full border border-slate-200 bg-white/90 backdrop-blur-xl flex items-center px-4 justify-between z-50 shadow-lg overflow-hidden">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                        <img src="/assets/Logo-Light-gd.png" alt="Korae" className="h-7 w-auto group-hover:scale-105 transition-transform" />
                    </Link>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {projectName ? (
                        <span className="hidden md:flex text-[11px] font-semibold tracking-wide uppercase text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full items-center gap-2">
                            {projectName}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-400 font-medium">New Studio Session</span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {templateUrl && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
                            title="Start New Project"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            <span>New Project</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 relative flex overflow-hidden bg-slate-50">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {templateUrl ? (
                    <Workspace
                        key={templateUrl}
                        templateUrl={templateUrl}
                        originalFileName={originalFileName}
                        initialProjectName={projectName}
                        initialDataRows={initialDataRows}
                        initialDataHeaders={initialDataHeaders}
                    />
                ) : (
                    <NewProjectModal
                        onClose={() => { }}
                        onCreate={handleProjectCreated}
                    />
                )}
            </main>
        </div>
    );
}
