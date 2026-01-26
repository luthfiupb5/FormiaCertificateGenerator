'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft, Hammer, Wrench } from 'lucide-react';

export default function CaptureSyncPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans flex items-center justify-center relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-2xl">
                {/* Icons Animation */}
                <div className="relative w-32 h-32 mx-auto mb-12">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                    <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
                        <Construction className="w-16 h-16 text-blue-400" />
                    </div>
                    {/* Floating Tools */}
                    <div className="absolute -top-4 -right-4 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 shadow-lg animate-float-delayed">
                        <Hammer className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 shadow-lg animate-float">
                        <Wrench className="w-6 h-6 text-neutral-400" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter mb-8 leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">Under</span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">Construction</span>
                </h1>

                <p className="text-xl md:text-2xl text-neutral-400 mb-10 leading-relaxed">
                    We're hammering out the details!
                    <br />
                    <span className="text-white font-medium">CaptureSync Live Photo Sync</span> will be getting to your hands soon.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/ourproducts">
                        <button className="px-8 py-3 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Products
                        </button>
                    </Link>
                    <button className="px-8 py-3 rounded-full border border-white/10 text-neutral-400 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-not-allowed opacity-50">
                        Join Waitlist (Soon)
                    </button>
                </div>
            </div>

            {/* Construction Tape Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-yellow-400/90 flex items-center overflow-hidden rotate-1 scale-110 translate-y-6 opacity-80 blur-[0.5px]">
                <div className="flex animate-marquee whitespace-nowrap font-mono font-black text-black text-lg tracking-widest uppercase items-center">
                    {Array(20).fill('🚧 WORK IN PROGRESS 🚧').map((text, i) => (
                        <span key={i} className="mx-4">{text}</span>
                    ))}
                </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-12 bg-yellow-400/90 flex items-center overflow-hidden -rotate-1 scale-110 -translate-y-6 opacity-80 blur-[0.5px]">
                <div className="flex animate-marquee-reverse whitespace-nowrap font-mono font-black text-black text-lg tracking-widest uppercase items-center">
                    {Array(20).fill('🚧 COMING SOON 🚧').map((text, i) => (
                        <span key={i} className="mx-4">{text}</span>
                    ))}
                </div>
            </div>

        </main>
    );
}
