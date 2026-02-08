'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-[#050505] text-neutral-300 font-sans selection:bg-violet-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <FileText className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-white">Terms and Conditions</h1>
                </div>

                <div className="space-y-12 text-lg leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Terms</h2>
                        <p>
                            By accessing the website at <a href="https://leenox.luthfibassam.space/" className="text-violet-400 hover:text-violet-300 underline underline-offset-4">https://leenox.luthfibassam.space/</a>, you are agreeing to be bound by these terms of service, all applicable laws, regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
                        <div className="space-y-4">
                            <p>
                                Permissions are granted to temporarily download one copy of the materials (information or software) on Luthfi Bassam U P's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 pl-4 text-neutral-400">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on Luthfi Bassam U P's website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ol>
                            <p>
                                This license shall automatically terminate if you violate any of these restrictions and may be terminated by Luthfi Bassam U P at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
                        <div className="space-y-4">
                            <p>
                                The materials on Luthfi Bassam U P's website are provided on an 'as is' basis. Luthfi Bassam U P makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                            <p>
                                Further, Luthfi Bassam U P does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Limitations</h2>
                        <p>
                            In no event shall Luthfi Bassam U P or its suppliers be liable for any damages (including without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Luthfi Bassam U P's website, even if Luthfi Bassam U P or a Luthfi Bassam U P authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Accuracy of materials</h2>
                        <p>
                            The materials appearing on Luthfi Bassam U P's website could include technical, typographical, or photographic errors. Luthfi Bassam U P does not warrant that any of the materials on its website are accurate, complete, or current. Luthfi Bassam U P may make changes to the materials contained on its website at any time without notice. However, Luthfi Bassam U P does not make any commitment to update the materials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Links</h2>
                        <p>
                            Luthfi Bassam U P has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Luthfi Bassam U P of the site. Use of any such linked website is at the user's own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Modifications</h2>
                        <p>
                            Luthfi Bassam U P may revise these terms of service for its website at any time without notice. By using this website, you agree to be bound by these Terms of Service. You can review the most current version of the Terms of Service at any time on this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of Bengaluru and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>

                </div>

                <div className="mt-20 pt-10 border-t border-white/10 text-center text-sm text-neutral-500">
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
        </main>
    );
}
