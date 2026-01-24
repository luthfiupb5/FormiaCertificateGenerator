import Link from 'next/link';
import { Award, Zap, LogOut, Plus, Layout } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Dashboard Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-surface/50 backdrop-blur sticky top-0 z-20">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">F</div>
                    <span className="font-bold">Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">Welcome, <b>Creator</b></span>
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold font-serif">Recent Projects</h1>
                    <Link href="/canvas">
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
                            <Plus className="w-5 h-5" />
                            Create New Project
                        </button>
                    </Link>
                </div>

                {/* Empty State / Placeholder for Recent Projects */}
                {/* TODO: Connect to Supabase 'projects' table */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Layout className="w-8 h-8 text-neutral-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                    <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
                        Get started by creating your first certificate project. It will appear here for quick access.
                    </p>
                    <Link href="/canvas">
                        <div className="flex flex-col gap-4 items-center">
                            <button className="btn btn-primary w-full max-w-xs py-4 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create New Project
                            </button>
                            <span className="text-neutral-500 text-xs">
                                or <span className="text-neutral-400 hover:text-white underline cursor-pointer">browse templates</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
