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
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">K</div>
            <span className="font-heading font-bold text-lg tracking-tight">Korae</span>
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
      <section className="py-24 overflow-hidden bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Stunning Templates. <span className="text-violet-400">Ready to Go.</span></h2>
          <p className="text-neutral-400 text-lg">Choose from professional designs or build your own from scratch.</p>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll w-[200%] gap-8">
            {[...Array(8)].flatMap((_, i) => [
              { color: "from-violet-500/20 to-blue-500/20", title: "Modern Diploma", type: "Education" },
              { color: "from-emerald-500/20 to-teal-500/20", title: "Course Completion", type: "Training" },
              { color: "from-orange-500/20 to-red-500/20", title: "Appreciation", type: "HR" },
              { color: "from-pink-500/20 to-rose-500/20", title: "Event Badge", type: "Conference" },
              { color: "from-blue-500/20 to-cyan-500/20", title: "Tech Certificate", type: "Hackathon" },
              { color: "from-purple-500/20 to-indigo-500/20", title: "Achievement", type: "Sports" },
            ]).map((template, i) => (
              <div key={i} className="flex-shrink-0 w-[400px] h-[280px] rounded-xl bg-neutral-900/50 border border-white/10 p-6 flex flex-col justify-between hover:border-violet-500/50 transition-colors group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>

                {/* Mock Certificate Layout */}
                <div className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/10 mb-4 mx-auto backdrop-blur-md"></div>
                  <div className="h-6 w-3/4 bg-white/20 mx-auto rounded my-2"></div>
                  <div className="h-4 w-1/2 bg-white/10 mx-auto rounded"></div>
                  <div className="mt-8 flex justify-between px-8">
                    <div className="h-8 w-20 bg-white/10 rounded"></div>
                    <div className="h-12 w-12 bg-white/10 rounded-lg"></div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center mt-4 border-t border-white/10 pt-4">
                  <div>
                    <h4 className="font-bold text-white">{template.title}</h4>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{template.type}</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold transition-all">Use Template</button>
                </div>
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

      {/* Main Features Grid (Detailed) */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto reveal-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything needed for<br />Professional Issuance.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {/* Large Card 1 */}
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 col-span-1 md:col-span-2 row-span-1 hover:border-white/20 transition-colors relative overflow-hidden group">
            <Layers className="mb-4 text-violet-400 w-8 h-8" />
            <h4 className="text-2xl font-bold mb-2">Advanced Layer Management</h4>
            <p className="text-neutral-400 max-w-sm">Organize your design with precision tools. Lock, hide, and reorder layers just like specialized design software.</p>
            <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-violet-900/20 to-transparent group-hover:from-violet-900/30 transition-colors"></div>
            {/* Mock UI Element */}
            <div className="absolute right-8 bottom-8 w-48 h-32 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md transform rotate-3 transition-transform group-hover:rotate-0"></div>
          </div>

          {/* Small Card 1 */}
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-end">
            <Zap className="mb-4 text-yellow-400 w-8 h-8" />
            <h4 className="text-xl font-bold mb-2">Instant Rendering</h4>
            <p className="text-neutral-400 text-sm">Our engine renders 100+ pages per second locally in your browser.</p>
          </div>

          {/* Small Card 2 */}
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-end">
            <Globe className="mb-4 text-blue-400 w-8 h-8" />
            <h4 className="text-xl font-bold mb-2">Anywhere Access</h4>
            <p className="text-neutral-400 text-sm">Your templates and data are synced safely to the cloud.</p>
          </div>

          {/* Large Card 2 */}
          <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 col-span-1 md:col-span-2 hover:border-white/20 transition-colors relative overflow-hidden group">
            <Download className="mb-4 text-green-400 w-8 h-8" />
            <h4 className="text-2xl font-bold mb-2">High-Res Print Ready</h4>
            <p className="text-neutral-400 max-w-sm">Export as CMYK-compatible PDFs or high-quality PNGs suitable for professional printing.</p>
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-t from-green-900/20 to-transparent group-hover:from-green-900/30 transition-colors"></div>
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
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">K</div>
              <span className="font-heading font-bold text-xl">Korae</span>
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

