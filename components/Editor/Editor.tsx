'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';
import UploadScreen from './UploadScreen';
import Workspace from './Workspace';

export default function Editor() {
    const [templateUrl, setTemplateUrl] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string>('');

    // If templateUrl is set, we mount the Workspace
    // If not, we mount the UploadScreen
    // This simple conditional rendering ensures that when we switch,
    // the components are completely unmounted/remounted, clearing any stuck state.

    const handleTemplateLoaded = (url: string, name: string) => {
        console.log("Editor: Template loaded", url, name);
        setTemplateUrl(url);
        setOriginalFileName(name);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset? This will clear everything.')) {
            setTemplateUrl(null);
            setOriginalFileName('');
        }
    };

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    // Check for logged in user on mount
    useEffect(() => {
        const stored = localStorage.getItem('formia_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('formia_user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 border-b border-border bg-surface/50 backdrop-blur flex items-center px-6 justify-between z-20 sticky top-0">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                            F
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Formia</h1>
                    </Link>
                    {originalFileName && (
                        <span className="hidden md:flex ml-4 text-xs font-mono text-neutral-400 bg-surface/50 border border-border px-3 py-1 rounded-full items-center gap-2">
                            {originalFileName}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* User Profile */}
                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">{user.name}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="text-[10px] text-neutral-400 hover:text-red-400 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-lg shadow-primary/20">
                                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="btn btn-secondary text-xs h-8 px-4">
                            Sign In
                        </Link>
                    )}

                    {templateUrl && (
                        <div className="h-6 w-px bg-white/10 mx-1" />
                    )}

                    {templateUrl && (
                        <button
                            onClick={handleReset}
                            className="btn btn-secondary text-sm gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                        >
                            <RefreshCcw className="w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 relative flex overflow-hidden bg-dot-pattern">
                {templateUrl ? (
                    <Workspace
                        key={templateUrl} // Force re-mount if url changes
                        templateUrl={templateUrl}
                        originalFileName={originalFileName}
                    />
                ) : (
                    <UploadScreen onTemplateLoaded={handleTemplateLoaded} />
                )}
            </main>
        </div>
    );
}
