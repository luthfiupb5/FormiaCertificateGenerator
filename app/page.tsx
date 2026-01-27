'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shapes, PenTool, Download, LayoutDashboard, CheckCircle2, Zap, Layers, Globe, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ThreeDCard from '@/components/ThreeDCard';
import GlassTiltCard from '@/components/GlassTiltCard';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50 transition-all duration-300">
        <div className="px-4 md:px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex justify-between items-center shadow-2xl shadow-black/50">
          <Link href="/" className="text-lg font-bold tracking-tight flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs shadow-lg shadow-violet-500/20 font-heading">F</div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 font-heading">Formia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/ourproducts" className="hover:text-white transition-colors">Products</Link>
            <Link href="/developer" className="hover:text-white transition-colors">About Us</Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                  )}
                  <span className="text-sm text-neutral-300">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2">
                  Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Log In</Link>
                <Link href="/auth/signup" className="group relative px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          <div className="absolute inset-x-4 top-4 bottom-24 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 flex flex-col">
            {/* User Profile Section */}
            {user && (
              <div className="mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || 'User'}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-neutral-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 mb-8">
              <Link
                href="/features"
                className="text-lg font-medium text-white hover:text-violet-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/ourproducts"
                className="text-lg font-medium text-white hover:text-violet-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/developer"
                className="text-lg font-medium text-white hover:text-violet-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="mt-auto flex flex-col gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-center font-medium hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 flex flex-col items-center text-center z-10">

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
      <section className="py-20 px-4 relative z-10 w-full flex justify-center">
        <div className="max-w-4xl w-full">
          <GlassTiltCard className="text-center group">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 p-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Ready to start?</h2>
              <Link href="/auth/signup">
                <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  Get Started Now
                </button>
              </Link>
            </div>
          </GlassTiltCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 pb-32 relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-neutral-400">
          <p>copyright © 2026 Luthfi Bassam U P. Designed, developed, and driven by AI thinking.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms and Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
