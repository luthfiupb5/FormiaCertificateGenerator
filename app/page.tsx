'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, Zap, Globe, Download, Menu, X, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Hero3D from '@/components/Hero3D';
import AnimatedBrand from '@/components/ui/AnimatedBrand';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useGSAP(() => {
    // Section Revelations
    const sections = gsap.utils.toArray('.reveal-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Hero Text Stagger
    gsap.fromTo(".reveal-text span",
      { y: 100, opacity: 0, rotateX: -20 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.2 }
    );

  }, { scope: container });

  return (
    <main ref={container} className="min-h-screen text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/assets/Logo-Light-gd.png" alt="Korae" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="pointer-events-auto hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          <Link href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">How it Works</Link>
          <Link href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</Link>
          <Link href="#use-cases" className="text-sm text-neutral-400 hover:text-white transition-colors">Use Cases</Link>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/signup" className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-md">
              Start Free
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center text-center relative z-20 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-medium text-violet-300 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>KORAE 2.0 IS LIVE</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold tracking-tighter leading-[1.05] mb-8 reveal-text">
            <span className="block text-white">Certificates.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-white animate-gradient-x">At Warp Speed.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed reveal-text">
            The next-generation engine for bulk certificate generation. Drag, drop, design, and export thousands of PDFs in seconds. Trusted by professionals worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center reveal-section">
            <Link href="/auth/signup" className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:scale-105 transition-transform overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Start Generating Now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By (Social Proof) */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-center text-sm text-neutral-500 font-mono uppercase tracking-widest mb-8">Powering credentials for forward-thinking teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos (Text for now for SEO) */}
            <span className="text-xl font-bold font-heading">TECHSTAR</span>
            <span className="text-xl font-bold font-heading">EVENTFLOW</span>
            <span className="text-xl font-bold font-heading">EDUCORE</span>
            <span className="text-xl font-bold font-heading">CERTIFY.IO</span>
            <span className="text-xl font-bold font-heading">ACADEMY+</span>
          </div>
        </div>
      </section>

      {/* Templates Marquee (New Premium Section) */}
      {/* Design Integrations (Replacement for Templates) */}
      <section className="py-24 overflow-hidden bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Design Anywhere. <span className="text-violet-400">Generate Here.</span></h2>
          <p className="text-neutral-400 text-lg">Compatible with exports from your favorite design tools. Just upload your background.</p>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll w-[200%] gap-8 items-center">
            {[...Array(2)].flatMap(() => [
              { name: "Canva", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
              { name: "Figma", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
              { name: "Adobe Illustrator", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
              { name: "Adobe Photoshop", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { name: "PowerPoint", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
              { name: "Google Slides", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { name: "InDesign", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
              { name: "Sketch", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            ]).map((tool, i) => (
              <div key={i} className={`flex-shrink-0 px-8 py-6 rounded-2xl ${tool.bg} ${tool.border} border flex items-center gap-4 min-w-[200px] justify-center hover:scale-105 transition-transform duration-300`}>
                <span className={`text-xl font-bold ${tool.color}`}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution (Why Korae) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto reveal-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Stop the <span className="text-red-400 line-through">Spreadsheet Hell</span>.</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Manual mail merges are prone to errors, slow, and frustrating. Korae makes it instant and pixel-perfect.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
            <h3 className="text-xl font-bold text-red-200 mb-4 flex items-center gap-2"><X className="w-5 h-5" /> The Hard Way</h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex gap-2">❌ Wrestling with Word Macros</li>
              <li className="flex gap-2">❌ Broken formatting on export</li>
              <li className="flex gap-2">❌ Can't handle custom fonts nicely</li>
              <li className="flex gap-2">❌ Sending emails manually one by one</li>
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-green-500/5 border border-green-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 blur-3xl"></div>
            <h3 className="text-xl font-bold text-green-200 mb-4 flex items-center gap-2 relative z-10"><Zap className="w-5 h-5" /> The Korae Way</h3>
            <ul className="space-y-3 text-neutral-300 relative z-10">
              <li className="flex gap-2">✅ Visual Drag & Drop Editor</li>
              <li className="flex gap-2">✅ Instant CSV/Excel Mapping</li>
              <li className="flex gap-2">✅ Perfect PDF/JPG Export</li>
              <li className="flex gap-2">✅ Cloud Storage Included</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works (Step by Step) */}
      <section id="how-it-works" className="py-24 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">From Data to Download.<br />In 3 Steps.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { title: "1. Upload Data", desc: "Drag and drop your CSV or Excel file containing recipient names, dates, and details.", icon: "📂" },
              { title: "2. Design Template", desc: "Use our visual editor to place text, images, and QR codes. Map columns to layers.", icon: "🎨" },
              { title: "3. Bulk Export", desc: "Click generate and watch Korae create thousands of personalized PDFs in seconds.", icon: "🚀" }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-violet-500/50 transition-colors reveal-section">
                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Vertical Layout */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-violet-400">Scale & Precision.</span></h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Every tool you need to manage thousands of certificates without breaking a sweat.</p>
        </div>

        <div className="space-y-24">
          {/* Feature 1: Layer Management */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 reveal-section">
            <div className="flex-1 order-2 md:order-1">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Advanced Layer Management</h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                Organize your design with precision tools. Lock, hide, and reorder layers just like specialized design software.
                Context-aware menus giving you full control over every element.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="aspect-video rounded-3xl bg-[#0A0A0A] border border-white/10 relative overflow-hidden group hover:border-violet-500/30 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent"></div>
                {/* Mock UI for Layers */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 backdrop-blur-md rounded-l-xl border-l border-y border-white/10 p-4 space-y-3 shadow-xl">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 w-full bg-white/5 rounded-lg border border-white/5 flex items-center px-4 gap-3">
                      <div className="w-4 h-4 rounded bg-white/20"></div>
                      <div className="h-2 w-24 bg-white/20 rounded"></div>
                      <div className="ml-auto w-4 h-4 rounded-full border border-white/20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Instant Rendering */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 reveal-section">
            <div className="flex-1">
              <div className="aspect-video rounded-3xl bg-[#0A0A0A] border border-white/10 relative overflow-hidden group hover:border-yellow-500/30 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/5 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-yellow-500/10 blur-3xl animate-pulse"></div>
                  <div className="relative z-10 bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-4">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-mono text-sm text-green-400">Rendering: 120fps</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Instant Rendering Engine</h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                Don't wait hours for generation. Our local-first engine renders 100+ pages per second directly in your browser.
                No server queues, no privacy risks.
              </p>
            </div>
          </div>

          {/* Feature 3: Print Ready */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 reveal-section">
            <div className="flex-1 order-2 md:order-1">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">High-Res Print Ready</h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                Export as CMYK-compatible PDFs or high-quality PNGs suitable for professional printing.
                We ensure your fonts and vectors stay crisp at any size.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="aspect-video rounded-3xl bg-[#0A0A0A] border border-white/10 relative overflow-hidden group hover:border-green-500/30 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                  <div className="h-16 w-1/3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-col">
                    <span className="text-xs text-neutral-500 mb-1">Format</span>
                    <span className="font-bold text-white">PDF</span>
                  </div>
                  <div className="h-16 w-1/3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-col">
                    <span className="text-xs text-neutral-500 mb-1">DPI</span>
                    <span className="font-bold text-white">300</span>
                  </div>
                  <div className="h-16 w-1/3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-col">
                    <span className="text-xs text-neutral-500 mb-1">Color</span>
                    <span className="font-bold text-white">CMYK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Cloud Sync */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 reveal-section">
            <div className="flex-1">
              <div className="aspect-video rounded-3xl bg-[#0A0A0A] border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-colors shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-blue-500/50 animate-ping"></div>
                    <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Anywhere Access</h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                Your templates and data are synced safely to the cloud. Access your projects from any device, anywhere in the world.
                Everything is backed up instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Built for every occasion.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Webinars", desc: "Issue attendance certificates to 1000s of zoom attendees instantly.", color: "bg-blue-500" },
              { title: "Education", desc: "Schools and EdTech platforms enabling automated diplomas.", color: "bg-orange-500" },
              { title: "Corporate", desc: "Employee appreciation, training completion, and internal awards.", color: "bg-purple-500" },
              { title: "Hackathons", desc: "Participation badges and winner certificates for tech events.", color: "bg-green-500" }
            ].map((useCase, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#050505] hover:-translate-y-1 transition-transform">
                <div className={`w-2 h-2 rounded-full ${useCase.color} mb-4`}></div>
                <h4 className="font-bold text-lg mb-2">{useCase.title}</h4>
                <p className="text-neutral-400 text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Rich FAQ Section */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto reveal-section">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "Is Korae free to use?", a: "Yes! Korae offers a generous free tier for individuals. You can design and export certificates without a credit card." },
            { q: "Can I use my own certificate template?", a: "Absolutely. You can upload any JPG or PNG image as your base template and overlay text on top of it." },
            { q: "How many certificates can I generate at once?", a: "Our engine is tested with up to 10,000 records in a single batch. It handles large datasets with ease." },
            { q: "Is my data secure?", a: "We prioritize security. Your CSV data is processed securely and we do not sell your recipient data to third parties." },
            { q: "Does it support different languages?", a: "Yes, Korae supports UTF-8 characters so you can generate certificates in virtually any language." }
          ].map((faq, i) => (
            <div key={i} className="border-b border-white/10 pb-6">
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Testimonials (Social Proof) */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Loved by <span className="text-violet-400">10,000+</span> Organizers.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "I used to spend 3 days making certificates for our hackathon. With Korae, it took 10 minutes.", author: "Alex Chen", role: "Hackathon Org", avatar: "A" },
              { quote: "The design editor is actually good. Usually these bulk tools have terrible alignment, but this is precise.", author: "Sarah Miller", role: "HR Director", avatar: "S" },
              { quote: "We generated 5,000 certificates for our webinar series without a single crash. Rock solid.", author: "James Wilson", role: "EdTech Founder", avatar: "J" }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-4 -left-4 text-6xl text-violet-500/20 font-serif">"</div>
                <p className="text-lg text-neutral-300 mb-6 relative z-10 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{testimonial.author}</h5>
                    <p className="text-xs text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Magnetic CTA */}
      <section className="py-32 flex justify-center text-center reveal-section relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-600/10 blur-[100px] pointer-events-none animate-pulse"></div>

        {/* Animated Particles/Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl px-6 relative z-10 p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white">
            Ready to save <span className="text-violet-500">hours?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join thousands of organizers generating certificates the smart way. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-110 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] active:scale-95">
              Get Started for Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors border border-white/10">
              Contact Sales
            </Link>
          </div>
          <p className="mt-8 text-xs text-neutral-500">Free forever for personal use • No installation needed</p>
        </div>
      </section>

      {/* Footer (SEO Optimized) */}
      <footer className="py-16 border-t border-white/10 bg-[#050505] text-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/Logo-Light-gd.png" alt="Korae" className="h-8 w-auto" />
            </div>
            <p className="text-neutral-500 max-w-sm mb-6">
              Korae is the premier online tool for bulk certificate generation. We help educators, HR professionals, and event organizers automate their workflow with pixel-perfect design tools.
            </p>
            <div className="flex gap-4 text-neutral-400">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/p/changelog" className="hover:text-white">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="mailto:support@korae.io" className="hover:text-white">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-neutral-600 text-xs">
          <p>© 2026 Korae. All rights reserved.</p>
          <p>Made with ❤️ for the community.</p>
        </div>
      </footer>
    </main >
  );
}

