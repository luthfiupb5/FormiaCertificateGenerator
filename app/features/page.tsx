import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Zap, Globe, Download, Wand2, Database, Shield, Smartphone } from 'lucide-react';
import GlassTiltCard from '@/components/GlassTiltCard';
import SpotlightFeatureCard from '@/components/SpotlightFeatureCard';

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 pb-32">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group mb-8 self-start md:self-center">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-medium tracking-wide uppercase mb-6">
                        <Wand2 className="w-3 h-3" />
                        <span>Premium Features</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                            Powerful Tools for
                        </span>
                        <br />
                        <span className="text-white">Modern Designers</span>
                    </h1>

                    <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
                        Everything you need to create, manage, and distribute certificates at scale.
                        Built with precision and designed for performance.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <SpotlightFeatureCard
                        icon={<Layers className="w-6 h-6" />}
                        title="Smart Editor"
                        description="Drag & drop interface with advanced layer management. Group, lock, and organize elements with professional precision."
                        color="violet"
                        delay="delay-0"
                    />

                    <SpotlightFeatureCard
                        icon={<Zap className="w-6 h-6" />}
                        title="Bulk Generation"
                        description="Generate thousands of certificates in seconds. Upload your CSV or Excel data and let our engine handle the rest."
                        color="blue"
                        delay="delay-100"
                    />

                    <SpotlightFeatureCard
                        icon={<Globe className="w-6 h-6" />}
                        title="Cloud Sync"
                        description="Your designs are always with you. Access your projects from any device with secure cloud synchronization."
                        color="emerald"
                        delay="delay-200"
                    />

                    <SpotlightFeatureCard
                        icon={<Download className="w-6 h-6" />}
                        title="High-Res Export"
                        description="Export in multiple formats including PDF, PNG, and JPG. Print-ready resolution for professional results."
                        color="pink"
                        delay="delay-300"
                    />

                    <SpotlightFeatureCard
                        icon={<Database className="w-6 h-6" />}
                        title="Dynamic Data Mapping"
                        description="Map your data fields visually. See real-time previews of how your data will look on the final certificate."
                        color="amber"
                        delay="delay-400"
                    />

                    <SpotlightFeatureCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Secure Storage"
                        description="Enterprise-grade security for your data and designs. Your assets are encrypted and protected."
                        color="cyan"
                        delay="delay-500"
                    />

                </div>

                {/* Call to Action */}
                <div className="mt-32 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                    <GlassTiltCard className="text-center group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 pointer-events-none"></div>
                        <div className="relative z-10 p-12">
                            <h2 className="text-3xl font-bold mb-6">Ready to experience the power?</h2>
                            <Link href="/auth/signup" className="inline-flex items-center px-8 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform">
                                Get Started Free
                            </Link>
                        </div>
                    </GlassTiltCard>
                </div>

            </div>
        </main>
    );
}
