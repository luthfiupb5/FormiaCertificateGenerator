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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
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
                    <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                        Sign Out
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">
                            ME
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <div>
                        <h1 className="text-4xl font-bold font-serif mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
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
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-16 text-center max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-2xl rotate-3 mx-auto mb-8 flex items-center justify-center shadow-2xl">
                                    <Layout className="w-10 h-10 text-neutral-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white">No projects found</h3>
                                <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
                                    Your dashboard is looking a bit empty. Create your first certificate design to populate this space.
                                </p>
                                <Link href="/canvas">
                                    <button className="btn btn-primary px-8">
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
