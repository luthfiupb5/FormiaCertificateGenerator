'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shapes, PenTool, Download, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingPage() {
  const container = useRef(null);
  const heroRef = useRef(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useGSAP(() => {
    // 1. Hero Text Stagger
    const tl = gsap.timeline();
    tl.from('.hero-word', {
      y: 120,
      opacity: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power4.out',
    })
      .from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.8')
      .from('.hero-btn', {
        scale: 0.9,
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
      }, '-=0.6');

    // ... rest of animations
    // 2. Scroll Reveals
    gsap.utils.toArray('.reveal-section').forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    });

    // 3. Floating Graphics
    gsap.to('.float-shape', {
      y: -25,
      rotation: 5,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 1.5,
    });

    // 4. "Certificates" Premium Animation
    gsap.fromTo('.anim-char',
      {
        y: 50,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.04,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.3
      }
    );

    // Subtle breathing motion for the text
    gsap.to('.anim-char', {
      y: -3,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: {
        each: 0.05,
        from: 'center'
      }
    });

  }, { scope: container });

  // Helper to split text
  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="anim-char inline-block" style={{ transformOrigin: 'bottom center', backfaceVisibility: 'hidden' }}>
        {char}
      </span>
    ));
  };

  return (
    <main ref={container} className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5 transition-all duration-300">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 relative group">
          <div className="w-6 h-6 bg-white rounded-md group-hover:rotate-12 transition-transform duration-300"></div>
          Formia
        </Link>
        <div className="flex gap-4">
          <Link href="/auth/signin" className={user ? "hidden" : "btn btn-outline text-sm px-6 py-2 rounded-full border-white/10 hover:bg-white hover:text-black transition-all"}>Log In</Link>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary text-sm px-6 py-2 rounded-full flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          ) : (
            <Link href="/auth/signup" className="btn btn-primary text-sm px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow">Sign Up Free</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">

        {/* Decorative Shapes */}
        <div className="float-shape absolute top-32 left-[10%] w-32 h-32 rounded-full border border-purple-500/20 blur-xl opacity-50"></div>
        <div className="float-shape absolute bottom-32 right-[10%] w-64 h-64 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>

        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-10 perspective-1000">
            <span className="hero-word inline-block">Design</span>{' '}
            <span className="hero-word inline-block font-serif italic text-[#8b5cf6] pr-2 relative">
              {/* Underline svg or decorative element could go here */}
              {renderAnimatedText('Certificates.')}
            </span> <br />
            <span className="hero-word inline-block">At Scale.</span>
          </h1>

          <p className="hero-sub text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-14 font-light leading-relaxed tracking-wide">
            The canvas for bulk creation. Map data, drag & drop, and generate thousands of PDFs in seconds.
          </p>

          <div className="hero-btn flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href={user ? "/dashboard" : "/auth/signup"}>
              <button className="btn btn-primary text-lg !px-10 !py-5 rounded-full shadow-[0_0_50px_-15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_80px_-20px_rgba(139,92,246,0.6)] hover:scale-105 transition-all duration-300">
                {user ? 'Go to Dashboard' : 'Get Started for Free'}
              </button>
            </Link>
            <Link href="#features">
              <button className="btn btn-outline text-lg !px-10 !py-5 rounded-full border-white/10 hover:bg-white/5 hover:border-white/30 backdrop-blur-sm transition-all duration-300">
                See How It Works
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <PenTool className="w-8 h-8 text-purple-400" />,
              title: "Freeform Canvas",
              desc: "Drag, drop, and design without constraints. Feels just like your favorite design tool."
            },
            {
              icon: <Shapes className="w-8 h-8 text-blue-400" />,
              title: "Smart Variables",
              desc: "Connect your Excel data. Columns become draggable variables on your canvas."
            },
            {
              icon: <Download className="w-8 h-8 text-green-400" />,
              title: "Instant Export",
              desc: "Generate zip files containing thousands of personalized PDFs in one click."
            }
          ].map((feature, i) => (
            <div key={i} className="reveal-section p-10 rounded-3xl bg-neutral-900/50 border border-white/5 hover:bg-neutral-900 hover:border-white/10 transition-colors group">
              <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-neutral-400 text-lg leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Big Visual Section */}
      <section className="reveal-section py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-neutral-900 to-black rounded-[3rem] border border-white/10 p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to recognize brilliance?</h2>
            <Link href="/auth/signup">
              <button className="btn btn-primary text-xl px-10 py-5">
                Start Creating Free <ArrowRight className="ml-2 w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-neutral-500">
        <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <span className="font-bold tracking-tight text-white">Formia</span>
        </div>
        <p>&copy; 2024 Formia Inc.</p>
      </footer>
    </main>
  );
}
