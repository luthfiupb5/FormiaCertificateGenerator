'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#050505] text-neutral-300 font-sans selection:bg-violet-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-white">Privacy Policy</h1>
                </div>

                <div className="space-y-8 text-lg leading-relaxed">
                    <p>
                        Your privacy is important to us. It is Luthfi Bassam U P's policy to respect your privacy regarding any information we may collect from you across our website, <a href="https://korae.watermelonbranding.in/" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">https://korae.watermelonbranding.in/</a>, and other sites we own and operate.
                    </p>

                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
                    </p>

                    <p>
                        We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
                    </p>

                    <p>
                        We don't share any personally identifying information publicly or with third-parties, except when required to by law.
                    </p>

                    <p>
                        Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.
                    </p>

                    <p>
                        You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
                    </p>

                    <p>
                        Your continued use of our website will be regarded as an acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
                    </p>

                    <p>
                        This policy is effective as of 27 July 2026.
                    </p>
                </div>

                <div className="mt-20 pt-10 border-t border-white/10 text-center text-sm text-neutral-500">
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
        </main>
    );
}
