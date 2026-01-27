'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Loader2 } from 'lucide-react';
import NewProjectModal from '@/components/Dashboard/NewProjectModal';
import Workspace from './Workspace';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useCanvasStore } from '@/lib/store';

export default function Editor() {
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    const [initialDataRows, setInitialDataRows] = useState<any[]>([]);
    const [initialDataHeaders, setInitialDataHeaders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { loadNodes, clearNodes } = useCanvasStore();

    // Check for ID and load project
    useEffect(() => {
        const loadProject = async () => {
            // Clear canvas nodes when component mounts
            clearNodes();

            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            if (id) {
                setIsLoading(true);
                const supabase = createClient();
                const { data: project, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (project && !error) {
                    console.log('Loaded project:', project);
                    setProjectName(project.name);
                    setOriginalFileName(project.original_file_name || 'Template');
                    setTemplateUrl(project.template_url);

                    // Load canvas nodes if they exist
                    if (project.canvas_data && Array.isArray(project.canvas_data)) {
                        console.log('Loading canvas nodes:', project.canvas_data);
                        loadNodes(project.canvas_data);
                    } else {
                        console.log('No canvas data found');
                    }

                    // Parse CSV if exists
                    if (project.csv_url) {
                        try {
                            // Fetch CSV content
                            const response = await fetch(project.csv_url);
                            const csvText = await response.text();
                            Papa.parse(csvText, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    setInitialDataRows(results.data);
                                    setInitialDataHeaders(results.meta.fields || []);
                                },
                            });
                        } catch (e) {
                            console.error("Error loading CSV:", e);
                        }
                    }
                }
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };

        loadProject();
    }, []);

    // If templateUrl is set, we mount the Workspace
    // If not, we mount the NewProjectModal
    // This simple conditional rendering ensures that when we switch,
    // the components are completely unmounted/remounted, clearing any stuck state.

    const handleProjectCreated = (data: any) => {
        console.log("Editor: Project Created", data);
        setProjectName(data.name);
        setOriginalFileName(data.templateOriginalName);
        setInitialDataRows(data.dataRows);
        setInitialDataHeaders(data.dataHeaders);
        setTemplateUrl(data.templateUrl);

        // Push URL with ID
        if (data.id) {
            window.history.pushState({}, '', `?id=${data.id}`);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset? This will clear everything.')) {
            setTemplateUrl(null);
            setOriginalFileName('');
            setProjectName('');
            setInitialDataRows([]);
        }
    };

    const [user, setUser] = useState<any>(null);

    // Check for logged in user on mount
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="flex bg-[#050505] h-screen w-full items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
            {/* Floating Glass Header */}
            <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-14 rounded-full border border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center px-2 justify-between z-50 shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
                <div className="flex items-center gap-3 pl-2">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold font-heading text-xs shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                            F
                        </div>
                        <h1 className="text-sm font-bold font-heading tracking-tight text-white/90">Formia</h1>
                    </Link>

                    <div className="h-4 w-px bg-white/10 mx-1" />

                    {projectName && (
                        <span className="hidden md:flex text-[10px] font-bold tracking-widest uppercase text-neutral-500 bg-white/5 border border-white/5 px-3 py-1 rounded-full items-center gap-2">
                            {projectName}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 pr-2">
                    {/* User Profile */}
                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                            {user.user_metadata?.avatar_url && (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt={user.user_metadata?.full_name || 'User'}
                                    className="w-8 h-8 rounded-full border-2 border-white/10"
                                />
                            )}
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-medium text-white/90">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors px-2"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/signin" className="px-5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors">
                            Sign In
                        </Link>
                    )}

                    {templateUrl && (
                        <button
                            onClick={handleReset}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 text-neutral-500 hover:text-red-500 transition-colors"
                            title="Reset Project"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 relative flex overflow-hidden bg-[#050505]">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {templateUrl ? (
                    <Workspace
                        key={templateUrl} // Force re-mount if url changes
                        templateUrl={templateUrl}
                        originalFileName={originalFileName}
                        initialProjectName={projectName} // Pass project name
                        initialDataRows={initialDataRows} // Pass initial CSV data
                        initialDataHeaders={initialDataHeaders} // Pass headers
                    />
                ) : (
                    <NewProjectModal
                        onClose={() => { }} // No close action for now as it replaces the main screen
                        onCreate={handleProjectCreated}
                    />
                )}
            </main>
        </div>
    );
}
