'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ProjectCard from '@/components/Dashboard/ProjectCard'; // Ensure this path is correct
import { Plus, Layout, Loader2, Sparkles, Search } from 'lucide-react';
// import { motion } from 'framer-motion'; // We might not have motion installed, checking json.. no motion. 
// Standard CSS animations it is, or install framer-motion. 
// User asked for "rich aesthetics", "animations". Using standard Tailwind animate-in for now to avoid install step unless necessary.

// Mock data for fallback
const MOCK_PROJECTS = [
    { id: '1', name: 'Certificate of Achievement', updated_at: new Date().toISOString(), thumbnail_url: '' },
    { id: '2', name: 'Workshop Participation 2024', updated_at: new Date(Date.now() - 86400000).toISOString(), thumbnail_url: '' },
];

export default function DashboardPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    setUser(user);
                    const { data, error } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('updated_at', { ascending: false });

                    if (!error && data) {
                        setProjects(data);
                    } else {
                        // If no table or error, simplistic fallback just to show UI (replace with empty state in prod)
                        // console.log("Using Mock Data due to DB error:", error);
                        // setProjects(MOCK_PROJECTS); // Only for dev demo
                        setProjects([]);
                    }
                } else {
                    // Redirect or show empty?
                    // For UI demo, let's just show local state or empty
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        try {
            const supabase = createClient();

            // 1. Fetch project to get file URLs
            const { data: project, error: fetchError } = await supabase
                .from('projects')
                .select('template_url, csv_url')
                .eq('id', projectId)
                .single();

            if (fetchError) {
                console.error("Error fetching project details:", fetchError);
                // Continue to try deleting from DB even if fetch fails, or maybe stop? 
                // Let's continue but warn.
            }

            // 2. Delete files from R2 if they exist
            if (project) {
                const deleteFile = async (url: string) => {
                    try {
                        const u = new URL(url);
                        const key = u.pathname.substring(1); // Remove leading slash
                        await fetch(`/api/storage?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
                    } catch (e) {
                        console.error('Error parsing/deleting file:', url, e);
                    }
                };

                if (project.template_url) await deleteFile(project.template_url);
                if (project.csv_url) await deleteFile(project.csv_url);
            }

            // 3. Delete from Supabase
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    return (
        <div className="min-h-screen bg-black font-sans selection:bg-primary/30">
            {/* Dashboard Header */}
            <header className="fixed top-0 w-full h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">F</div>
                    <span className="font-bold text-lg tracking-tight">Formia</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:bg-white/10 focus:border-white/20 outline-none transition-all placeholder:text-neutral-600"
                        />
                    </div>
                    <div className="w-px h-6 bg-white/10 hidden md:block" />

                    {/* User Profile Dropdown */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-3 hover:bg-white/5 rounded-full pl-2 pr-4 py-1.5 transition-colors border border-transparent hover:border-white/10"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt={user.user_metadata?.full_name || 'User'}
                                        className="w-8 h-8 rounded-full border border-white/20"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px]">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                                            {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                )}
                                <span className="text-sm font-medium text-neutral-300 hidden md:block">
                                    {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                                </span>
                            </button>

                            {profileDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/10 bg-white/5">
                                            <p className="text-sm font-medium text-white">
                                                {user.user_metadata?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs text-neutral-400 truncate mt-1">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="p-1">
                                            <button
                                                onClick={async () => {
                                                    const supabase = createClient();
                                                    await supabase.auth.signOut();
                                                    window.location.href = '/';
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <div>
                        <h1 className="text-4xl font-bold font-heading mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                            Recent Masterpieces
                        </h1>
                        <p className="text-neutral-400">Continue where you left off or start a new creation.</p>
                    </div>
                    <Link href="/canvas">
                        <button className="btn btn-primary shadow-xl shadow-white/5 gap-2 group">
                            <Sparkles className="w-4 h-4 text-purple-600 group-hover:text-black transition-colors" />
                            <span>Create New Project</span>
                        </button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
                    </div>
                ) : (
                    <>
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700 delay-150">
                                {/* Create New Card - Always first or separate? Let's put it as the first card for easy access */}
                                <Link href="/canvas" className="group relative bg-white/5 border border-white/5 border-dashed hover:border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-white/10 aspect-[4/3]">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white group-hover:text-black text-white">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="font-medium group-hover:text-white text-neutral-400 transition-colors">Create New Project</span>
                                </Link>

                                {/* Project List */}
                                {filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onDelete={handleDeleteProject}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.15)] hover:border-violet-500/30 transition-all duration-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

                                <div className="w-24 h-24 bg-gradient-to-tr from-[#1a1a1a] to-[#0a0a0a] rounded-2xl rotate-3 mx-auto mb-8 flex items-center justify-center shadow-2xl ring-1 ring-white/5 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 relative z-10">
                                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"></div>
                                    <Layout className="w-10 h-10 text-neutral-500 group-hover:text-violet-400 transition-colors" />
                                </div>

                                <h3 className="text-3xl font-bold font-heading mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-violet-200 transition-all">No projects found</h3>
                                <p className="text-neutral-400 mb-10 max-w-md mx-auto leading-relaxed text-sm">
                                    Your dashboard is looking a bit empty. Create your first certificate design to populate this space.
                                </p>

                                <Link href="/canvas" className="relative z-10 inline-block">
                                    <button className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 hover:bg-violet-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                        Start Creating
                                    </button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
