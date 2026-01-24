'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shapes, PenTool, Download } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingPage() {
  const container = useRef(null);
  const heroRef = useRef(null);

  useGSAP(() => {
    // 1. Hero Text Stagger
    const tl = gsap.timeline();
    tl.from('.hero-word', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
    })
      .from('.hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5')
      .from('.hero-btn', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      }, '-=0.4');

    // 2. Scroll Reveals
    gsap.utils.toArray('.reveal-section').forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // 3. Floating Graphics
    gsap.to('.float-shape', {
      y: -20,
      rotation: 10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 1,
    });

    // 4. "Certificates" Premium Animation
    // Minimal, clean slide-up reveal
    gsap.fromTo('.anim-char',
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03, // Tighter stagger for a cohesive word reveal
        duration: 1,
        ease: 'power3.out', // Smooth, no bounce
        delay: 0.2
      }
    );

    // Subtle breathing motion for the text
    gsap.to('.anim-char', {
      y: -5,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: {
        each: 0.1,
        from: 'center'
      }
    });

  }, { scope: container });

  // Helper to split text
  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="anim-char inline-block" style={{ transformOrigin: 'bottom center' }}>
        {char}
      </span>
    ));
  };

  return (
    <main ref={container} className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-black/50 border-b border-white/5">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full"></div>
          Formia
        </Link>
        <div className="flex gap-4">
          <Link href="/auth/signin" className="btn btn-outline text-sm px-5 py-2">Log In</Link>
          <Link href="/auth/signup" className="btn btn-primary text-sm px-5 py-2">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">

        {/* Decorative Shapes */}
        <div className="float-shape absolute top-32 left-[10%] w-32 h-32 rounded-full border border-purple-500/30 blur-sm"></div>
        <div className="float-shape absolute bottom-32 right-[10%] w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-xl rotate-12 blur-md"></div>
        <div className="float-shape absolute top-40 right-[20%] w-16 h-16 bg-white/10 rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
            <span className="hero-word inline-block">Design</span>{' '}
            <span className="hero-word inline-block font-serif italic text-[#8b5cf6] pr-2">
              {renderAnimatedText('Certificates.')}
            </span> <br />
            <span className="hero-word inline-block">At Scale.</span>
          </h1>

          <p className="hero-sub text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The canvas for bulk creation. Map data, drag & drop, and generate thousands of PDFs in seconds.
          </p>

          <div className="hero-btn flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <button className="btn btn-primary text-lg !px-8 !py-4 shadow-[0_0_40px_-10px_rgba(120,119,255,0.5)]">
                Get Started for Free
              </button>
            </Link>
            <Link href="#features">
              <button className="btn btn-outline text-lg !px-8 !py-4">
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
