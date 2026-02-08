'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Zap, ArrowLeft, PenTool, Camera } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function OurProductsPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">Our Products</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Tools designed to amplify your creativity and productivity.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Leenox */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <ProductCard
                            title="Leenox"
                            description="The ultimate certificate generation tool. Design templates, map CSV data, and generate thousands of certificates in seconds. Built for speed and scale."
                            icon={<PenTool className="w-7 h-7" />}
                            href="https://leenox.luthfibassam.space"
                            color="violet"
                            isExternal={true}
                        />
                    </div>

                    {/* CaptureSync */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <ProductCard
                            title="CaptureSync Live"
                            description="Real-time photo synchronization for heavy workflows. Sync, edit, and share photos instantly as they are captured. The future of live event photography."
                            icon={<Camera className="w-7 h-7" />}
                            href="/capturesync"
                            color="blue"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
