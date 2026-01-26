'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail, Phone, Instagram, ArrowLeft } from 'lucide-react';

export default function DeveloperPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans flex flex-col items-center justify-center p-6 relative">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-900/20 via-transparent to-transparent blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="max-w-3xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Back Button */}
                <div className="absolute -top-20 left-0">
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-10">

                    {/* Profile Image */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                            <Image
                                src="/assets/dp.jpg"
                                alt="Developer Profile"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-2">
                                Luthfi Bassam U P
                            </h1>
                            <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium tracking-wide uppercase">
                                Fullstack Developer
                            </div>
                        </div>

                        <p className="text-neutral-400 leading-relaxed text-lg">
                            AI enthusiast, fullstack developer, and a graphic designer. Passionate about building beautiful, functional, and scalable web applications that solve real-world problems.
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                            <SocialLink href="https://github.com/luthfiupb5" icon={<Github className="w-5 h-5" />} label="GitHub" />
                            <SocialLink href="https://www.linkedin.com/in/luthfibassamup/" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                            <SocialLink href="https://www.instagram.com/7uthfii/" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href="mailto:connect.luthfi05@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" />
                            <SocialLink href="https://wa.me/917356556087" icon={<Phone className="w-5 h-5" />} label="WhatsApp" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 group relative"
            aria-label={label}
        >
            {icon}
            <span className="sr-only">{label}</span>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {label}
            </div>
        </a>
    );
}
