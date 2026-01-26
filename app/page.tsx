'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shapes, PenTool, Download, LayoutDashboard, CheckCircle2, Zap, Layers, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ThreeDCard from '@/components/ThreeDCard';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-900/20 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 transition-all duration-300">
        <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex justify-between items-center shadow-2xl shadow-black/50">
          <Link href="/" className="text-lg font-bold tracking-tight flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs shadow-lg shadow-violet-500/20 font-heading">F</div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 font-heading">Formia</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/auth/signin" className={user ? "hidden" : "text-sm font-medium text-neutral-400 hover:text-white transition-colors"}>Log In</Link>
            {user ? (
              <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2">
                Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link href="/auth/signup" className="group relative px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full"></div>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-4 flex flex-col items-center text-center z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="tracking-wide uppercase text-[10px]">New Release 2.0</span>
        </div>

        {/* Main Title */}
        <h1 className="max-w-4xl mx-auto text-6xl md:text-8xl font-bold font-heading tracking-tighter leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500">Design Certificates.</span>
          <br />
          <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#fff,theme(colors.violet.400),theme(colors.blue.400),#fff)] bg-[length:200%_auto] animate-shimmer">
            At Scale.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-neutral-400 leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          Design beautiful certificates, map your data, and generate thousands of PDFs in seconds. The ultimate tool for bulk creativity.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <Link href="/auth/signup">
            <button className="relative px-8 py-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-white font-medium overflow-hidden group hover:border-violet-500/50 transition-colors shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center gap-2">
                Start Building Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <Link href="#features">
            <button className="px-8 py-4 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors font-medium">
              Documentation
            </button>
          </Link>
        </div>

        {/* Hero Visual / Glow */}
        {/* Hero Visual / Glow */}
        <div className="mt-20 w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <ThreeDCard>
            {/* App Screenshot */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/assets/canvas%20demo.png"
                alt="Formia Application Interface"
                className="w-full h-auto object-contain"
              />
            </div>
          </ThreeDCard>
        </div>

        {/* Trusted By Carousel */}
        <div className="mt-24 w-full">
          <p className="text-sm font-medium text-neutral-500 mb-8 uppercase tracking-widest">Trusted by 200+ companies</p>

          <div className="relative w-full overflow-hidden group">
            {/* Gradient Masks (Feather) */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-20 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] w-max">
              {/* Triple the logos for smoother seamless loop on wide screens */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-20 items-center">
                  {['FeatherDev', 'Boltshift', 'GlobalBank', 'Lightbox', 'Spherule', 'Nietzsche'].map((name) => (
                    <span key={`${i}-${name}`} className="text-xl font-bold font-sans tracking-tight text-neutral-600 hover:text-white transition-colors cursor-default flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-neutral-800 flex-shrink-0"></div>
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Features "Bento Grid" section */}
      <section id="features" className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">Everything you need.</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Powerful features wrapped in a stunning interface. Built for speed, designed for scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Item */}
            <div className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-20">
                <div className="w-64 h-64 bg-violet-600 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Unlimited Layers</h3>
                <p className="text-neutral-400 leading-relaxed max-w-md">Stack text, images, and shapes with full control. Group, lock, and organize your certificate elements just like in high-end design software.</p>
              </div>
            </div>

            {/* Tall Item */}
            <div className="md:row-span-2 p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-colors group relative overflow-hidden flex flex-col">
              <div className="absolute bottom-0 left-0 p-10 opacity-20">
                <div className="w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Instant Generate</h3>
                <p className="text-neutral-400 leading-relaxed mb-8">Process thousands of records in seconds. Our optimized engine handles the heavy lifting.</p>

                {/* Visual representation */}
                <div className="mt-auto w-full h-40 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                    <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Item 1 */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cloud Synced</h3>
              <p className="text-sm text-neutral-400">Access your designs from anywhere. Always safe.</p>
            </div>

            {/* Small Item 2 */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Export Anywhere</h3>
              <p className="text-sm text-neutral-400">PDF, PNG, or JPG. High resolution print-ready files.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-1 bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-violet-500/50">
          <div className="bg-[#050505] rounded-[calc(3rem-4px)] px-6 py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Ready to start?</h2>
              <Link href="/auth/signup">
                <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  Get Started Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600"></div>
            <span className="font-bold tracking-tight">Formia</span>
          </div>
          <div className="text-sm text-neutral-500">
            &copy; 2024 Formia Inc. Design by Antigravity.
          </div>
        </div>
      </footer>

    </main>
  );
}
