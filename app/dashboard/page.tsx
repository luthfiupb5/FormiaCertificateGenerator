import Link from 'next/link';
import { Award, Zap, LogOut } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Dashboard Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-surface/50 backdrop-blur sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">F</div>
                    <span className="font-bold">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">Welcome, <b>Creator</b></span>
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
                <p className="text-neutral-400 mb-10">Select a certificate type to start automating</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Option 1: Participation */}
                    <Link href="/canvas?type=participation" className="group relative bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Participation Certificate</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Ideal for events, webinars, and workshops. Bulk generate certificates for all attendees from a CSV list.
                        </p>
                    </Link>

                    {/* Option 2: Prize / Merit */}
                    <Link href="/canvas?type=prize" className="group relative bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors">Prize / Merit Certificate</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Perfect for winners and special recognitions. Advanced styling options for 1st, 2nd, and 3rd place distinctions.
                        </p>
                    </Link>
                </div>
            </main>
        </div>
    );
}
