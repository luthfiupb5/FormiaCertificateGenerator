'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter, ArrowLeft } from 'lucide-react';

export default function DeveloperPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-hidden font-sans flex flex-col items-center justify-center p-6 relative">

            {/* Subtle Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-[#050505] to-[#050505]"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="max-w-2xl w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">

                {/* Navigation */}
                <div className="absolute -top-24 left-0 md:-left-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                </div>

                <div className="text-center space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                            Luthfi Bassam U P
                        </h1>
                        <p className="text-violet-400 font-mono text-sm tracking-widest uppercase opacity-80">
                            Fullstack Developer // AI Engineer
                        </p>
                    </div>

                    {/* Manifesto / Bio */}
                    <div className="prose prose-invert prose-lg mx-auto text-neutral-400 leading-relaxed">
                        <p>
                            Building at the intersection of design and artificial intelligence.
                            I believe in creating software that feels <span className="text-white">alive</span>—tools that don't just function, but anticipate and adapt.
                        </p>
                        <p>
                            Korae is a testament to this philosophy. Driven by AI thinking, built for scale, and designed for those who value craftsmanship.
                        </p>
                    </div>

                    {/* Minimalist Social Links */}
                    <div className="flex justify-center gap-8 pt-8 border-t border-white/5 mt-12">
                        <MinimalLink href="https://github.com/luthfiupb5" icon={<Github className="w-5 h-5" />} label="GitHub" />
                        <MinimalLink href="https://www.linkedin.com/in/luthfibassamup/" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                        <MinimalLink href="https://twitter.com/luthfi_bassam" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
                        <MinimalLink href="mailto:connect.luthfi05@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" />
                    </div>
                </div>
            </div>
        </main>
    );
}

function MinimalLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
