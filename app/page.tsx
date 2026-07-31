'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Cpu, Users } from 'lucide-react';

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(240,240,240,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/assets/Logo-Dark-gd.png" alt="Korae" className="h-[18px] w-auto" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-10 cursor-pointer">
          <a href="#features" className="nav-label hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="nav-label hover:text-slate-900 transition-colors">How it works</a>
          <a href="#features" className="nav-label hover:text-slate-900 transition-colors font-bold text-emerald-600">100% Free</a>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center">
          <Link href="/canvas" className="nav-btn-fill">
            Start Creating →
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── STACKING CARDS ──────────────────────────────────────────────────────────
const CARDS = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Instant Bulk Generation',
    desc: 'Upload a CSV with 10,000 names and watch Korae render every certificate inside your browser in seconds. Zero server wait times.',
    color: '#e8e4ff',
    accent: '#7c3aed',
    visual: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-48 h-48">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl border-2"
              style={{
                transform: `translate(${i * 6}px, ${i * 6}px) scale(${1 - i * 0.04})`,
                borderColor: `hsl(262, 80%, ${80 - i * 8}%)`,
                backgroundColor: `hsl(262, 80%, ${96 - i * 3}%)`,
                zIndex: 5 - i,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Zap className="w-16 h-16 text-violet-600 opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Zero Data Leaves Your Device',
    desc: 'Everything — template rendering, data parsing, PDF generation — happens locally in your browser. Your data is never uploaded anywhere.',
    color: '#e4f5ee',
    accent: '#059669',
    visual: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-48 h-48">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-full border-2"
              style={{
                inset: `${i * 20}px`,
                borderColor: `hsl(152, 70%, ${60 - i * 15}%)`,
                backgroundColor: `hsl(152, 70%, ${95 - i * 4}%)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Shield className="w-16 h-16 text-emerald-600 opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'Visual Template Editor',
    desc: 'Drag-and-drop text fields. Map columns to positions. See your exact output before you generate. What you see is what you export.',
    color: '#e8f0fe',
    accent: '#2563eb',
    visual: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-52 h-36 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
          <div className="absolute inset-3 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center gap-2">
            <div className="h-3 w-24 bg-blue-100 rounded" />
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-2 w-20 bg-slate-100 rounded" />
          </div>
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded font-mono">
            {'{Name}'}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'No Account Required',
    desc: 'Open the website. Upload your template. Upload your data. Generate. Download. Done. No login, no subscription, no friction.',
    color: '#fef3e2',
    accent: '#d97706',
    visual: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col gap-2 w-44">
          {['Upload Template', 'Upload CSV', 'Generate', 'Download ZIP'].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `hsl(38, 90%, ${50 + i * 5}%)` }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium text-[#2b2b2b]">{step}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function StackingCardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = -rect.top;
      const totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, sectionTop / totalScrollable));
      const N = CARDS.length;
      // rawStep ranges from 0.0 to 3.0 across the scroll section
      const rawStep = progress * (N - 1);
      const activeIdx = Math.min(Math.floor(rawStep + 0.5), N - 1);
      setActiveCard(activeIdx);

      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        if (i === 0) {
          // Card 0: Base card. Scales down slightly as newer cards stack on top of it.
          const depth = Math.max(0, rawStep);
          const scale = Math.max(0.88, 1 - depth * 0.04);
          card.style.transform = `translate3d(0px, 0px, 0px) scale(${scale})`;
          card.style.opacity = '1';
          card.style.zIndex = '10';
        } else {
          // Cards 1..N-1: enter from below (600px offscreen) as user scrolls
          const entryStart = i - 1;
          const entryEnd = i;

          if (rawStep < entryStart) {
            // Below screen waiting to enter
            card.style.transform = `translate3d(0px, 100vh, 0px) scale(0.95)`;
            card.style.opacity = '0';
            card.style.zIndex = String((i + 1) * 10);
            card.style.pointerEvents = 'none';
          } else if (rawStep >= entryStart && rawStep <= entryEnd) {
            // Currently sliding up over the previous cards
            const t = rawStep - entryStart; // 0.0 -> 1.0
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const translateY = (1 - eased) * 100; // % of vh
            const opacity = Math.min(1, t * 2.5);

            card.style.transform = `translate3d(0px, ${translateY}vh, 0px) scale(1)`;
            card.style.opacity = String(opacity);
            card.style.zIndex = String((i + 1) * 10);
            card.style.pointerEvents = 'auto';
          } else {
            // Landed on top of stack. Scales down slightly as subsequent cards enter.
            const depthAfter = rawStep - i;
            const scale = Math.max(0.88, 1 - depthAfter * 0.04);
            card.style.transform = `translate3d(0px, 0px, 0px) scale(${scale})`;
            card.style.opacity = '1';
            card.style.zIndex = String((i + 1) * 10);
            card.style.pointerEvents = 'auto';
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative bg-[#f0f0f0]" style={{ height: `${CARDS.length * 100}vh` }}>
      <div
        className="sticky top-0 h-screen overflow-hidden relative flex flex-col items-center justify-center"
        style={{ backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        {/* Section Label */}
        <div className="absolute top-12 left-8 right-8 flex items-center justify-between z-50 pointer-events-none">
          <span className="mono-label text-[#2b2b2b]/50">Why Korae</span>
          <span className="mono-label text-[#2b2b2b]/40">0{activeCard + 1} / 0{CARDS.length}</span>
        </div>

        {/* Background section heading */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span
            className="text-[clamp(80px,15vw,180px)] font-black tracking-tighter leading-none text-[#2b2b2b]/[0.03] uppercase"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            FEATURES
          </span>
        </div>

        {/* ── CARD STACK CONTAINER — 440px height, centered ── */}
        <div
          className="relative w-full max-w-[420px]"
          style={{ height: '440px' }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col will-change-transform bg-white"
              style={{
                border: `1px solid ${card.accent}30`,
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
                transformOrigin: 'center top',
              }}
            >
              {/* Card Header Tag */}
              <div className="px-6 py-3 flex items-center justify-between border-b" style={{ borderColor: `${card.accent}20`, backgroundColor: `${card.color}` }}>
                <div className="flex items-center gap-2" style={{ color: card.accent }}>
                  {card.icon}
                  <span className="mono-label font-bold text-[13px]" style={{ color: card.accent }}>Feature 0{i + 1}</span>
                </div>
                <span className="text-[11px] font-mono tracking-wider opacity-60 uppercase" style={{ color: card.accent }}>
                  {card.title}
                </span>
              </div>

              {/* Visual area */}
              <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: card.color }}>
                {card.visual}
              </div>

              {/* Text content - solid opaque background */}
              <div className="px-7 pt-4 pb-6 bg-white border-t border-slate-100">
                <h3 className="text-[20px] font-bold text-[#2b2b2b] tracking-tight leading-tight mb-1.5">
                  {card.title}
                </h3>
                <p className="text-[13px] text-[#656565] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress pill dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
          {CARDS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeCard ? '28px' : '6px',
                height: '6px',
                backgroundColor: i <= activeCard ? '#2b2b2b' : 'rgba(43,43,43,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CATCHPHRASE SECTION ─────────────────────────────────────────────────────
function CatchphraseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const lines = [
    'Generating ten thousand',
    'PDFs used to take hours.',
    'We moved the entire',
    'engine to your browser.',
    'Finish in seconds.',
  ];

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        const lineRect = line.getBoundingClientRect();
        const lineCenter = lineRect.top + lineRect.height / 2;
        const progress = Math.max(0, Math.min(1, 1 - (lineCenter - viewH * 0.65) / (viewH * 0.4)));

        line.style.opacity = String(0.15 + progress * 0.85);
        line.style.filter = `blur(${(1 - progress) * 4}px)`;
        line.style.transform = `translateY(${(1 - progress) * 24}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-40 px-8 bg-[#2b2b2b] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <span className="mono-label text-[#fafafa]/40 block mb-16">The Architecture</span>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <span
              key={i}
              ref={el => { lineRefs.current[i] = el; }}
              className="block font-bold text-[#fafafa] leading-[1.05] tracking-tight"
              style={{
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontFamily: 'var(--font-satoshi)',
                opacity: 0.15,
                transition: 'opacity 0.1s, filter 0.1s, transform 0.1s',
                willChange: 'opacity, filter, transform',
              }}
            >
              {i === 2 || i === 4 ? (
                <em style={{ fontStyle: 'italic' }}>{line}</em>
              ) : line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS (Horizontal scroll reveal) ────────────────────────────────
const STEPS = [
  { num: '01', title: 'Drop your template', desc: 'Upload a PDF or image of your certificate design. Korae renders it instantly in the canvas.', mono: 'Upload' },
  { num: '02', title: 'Map your data', desc: 'Upload a CSV or Excel file. Drag column names onto your canvas to link data fields to positions.', mono: 'Connect' },
  { num: '03', title: 'Preview live', desc: 'See exactly how every certificate will look. Navigate through your dataset row by row before exporting.', mono: 'Verify' },
  { num: '04', title: 'Export & done', desc: 'Click Export. Korae generates every PDF or JPG in parallel inside your browser and downloads a ZIP.', mono: 'Export' },
];

function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      stepRefs.current.forEach((step) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - (rect.top - window.innerHeight * 0.6) / (window.innerHeight * 0.35)));
        step.style.opacity = String(progress);
        step.style.transform = `translateY(${(1 - progress) * 32}px)`;
      });

      // Animate the progress line
      if (lineRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - rect.top / (window.innerHeight * 0.5)));
        lineRef.current.style.height = `${progress * 100}%`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-40 bg-[#f0f0f0]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex items-end justify-between mb-24">
          <div>
            <span className="mono-label text-[#2b2b2b]/40 block mb-3">Process</span>
            <h2 className="editorial-heading text-[#2b2b2b]">
              How it<br /><em>works.</em>
            </h2>
          </div>
          <Link href="/canvas" className="hidden md:flex items-center gap-2 nav-btn-fill">
            Try it now →
          </Link>
        </div>

        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-0 top-0 w-px h-full bg-[#2b2b2b]/10">
            <div
              ref={lineRef}
              className="w-full bg-[#2b2b2b] transition-none"
              style={{ height: '0%' }}
            />
          </div>

          <div className="pl-12 space-y-24">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={el => { stepRefs.current[i] = el; }}
                className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start"
                style={{ opacity: 0, transform: 'translateY(32px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div>
                  <span className="mono-label text-[#2b2b2b]/30 block mb-2">{step.mono}</span>
                  <span className="text-[60px] font-black text-[#2b2b2b]/10 leading-none tracking-tighter" style={{ fontFamily: 'var(--font-satoshi)' }}>
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-[28px] font-bold text-[#2b2b2b] tracking-tight mb-3">{step.title}</h3>
                  <p className="text-[17px] text-[#656565] leading-relaxed max-w-md">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS MARQUEE ───────────────────────────────────────────────────────────
const STATS = [
  { value: '0', label: 'Server Calls' },
  { value: '∞', label: 'Certificates' },
  { value: '100%', label: 'Private' },
  { value: '<5s', label: 'Avg Export' },
  { value: 'Free', label: 'Forever' },
  { value: 'PDF + JPG', label: 'Formats' },
];

function StatsMarquee() {
  return (
    <div className="py-10 bg-[#2b2b2b] overflow-hidden border-y border-[#fafafa]/5">
      <div className="flex animate-scroll whitespace-nowrap gap-0">
        {[...STATS, ...STATS, ...STATS].map((stat, i) => (
          <div key={i} className="inline-flex items-center gap-10 px-12">
            <span className="text-[28px] font-black text-[#fafafa] tracking-tight" style={{ fontFamily: 'var(--font-satoshi)' }}>
              {stat.value}
            </span>
            <span className="mono-label text-[#fafafa]/40">{stat.label}</span>
            <span className="text-[#fafafa]/20">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="bg-[#f0f0f0] relative overflow-hidden flex flex-col justify-center items-center px-8 min-h-[calc(100vh-116px)] py-12">
      {/* Background large text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-black tracking-tighter uppercase text-[#2b2b2b]/[0.04]"
          style={{ fontSize: 'clamp(80px, 18vw, 260px)', fontFamily: 'var(--font-satoshi)', lineHeight: 1 }}
        >
          KORAE
        </span>
      </div>

      <div className="max-w-[900px] w-full mx-auto text-center relative z-10 my-auto">
        <span className="mono-label text-[#2b2b2b]/40 block mb-4">Ready to initialize?</span>
        <h2
          className="font-bold text-[#2b2b2b] tracking-tight leading-[1.0] mb-6"
          style={{ fontSize: 'clamp(40px, 6.5vw, 88px)', fontFamily: 'var(--font-satoshi)' }}
        >
          Start generating<br />
          <em>certificates.</em>
        </h2>
        <p className="text-[15px] md:text-[17px] text-[#656565] max-w-md mx-auto mb-8 leading-relaxed">
          No account. No upload. No server. Just open, drop your files, and export.
        </p>
        <Link
          href="/canvas"
          className="inline-flex items-center gap-3 bg-[#2b2b2b] text-[#fafafa] px-8 py-3.5 rounded-full font-semibold text-[14px] hover:scale-105 active:scale-95 transition-transform shadow-xl"
        >
          Open Certificate Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#2b2b2b] h-[56px] px-8 border-t border-[#fafafa]/5 flex items-center">
      <div className="max-w-[1440px] w-full mx-auto flex flex-row justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <img src="/assets/Logo-Light-gd.png" alt="Korae" className="h-[14px] w-auto" />
          <span className="text-[#fafafa]/40 border-l border-[#fafafa]/10 pl-4 text-[12px] leading-none">
            Browser-native bulk certificate generation.
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/privacy-policy" className="mono-label text-[#fafafa]/40 hover:text-[#fafafa]/80 transition-colors text-[10px] leading-none">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="mono-label text-[#fafafa]/40 hover:text-[#fafafa]/80 transition-colors text-[10px] leading-none">
            Terms
          </Link>
          <Link href="/developer" className="mono-label text-[#fafafa]/40 hover:text-[#fafafa]/80 transition-colors text-[10px] leading-none">
            Documentation
          </Link>
          <span className="mono-label text-[#fafafa]/25 text-[10px] leading-none">© 2026 Korae</span>
        </div>
      </div>
    </footer>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#f0f0f0] pt-24 pb-16 px-6"
      style={{ backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      <div className="text-center max-w-4xl mx-auto relative z-10 my-auto">
        <div className="inline-flex items-center gap-3 mb-8 flex-wrap justify-center">
          {['Zero Servers', 'Privacy First', '10k+ Certs/min', 'Free Forever'].map((badge, i) => (
            <span key={i} className="mono-label border border-[#2b2b2b]/15 bg-[#2b2b2b]/5 px-3 py-1.5 rounded-full text-[#2b2b2b]/60">
              {badge}
            </span>
          ))}
        </div>

        {/* Main headline */}
        <h1
          className="font-bold text-[#2b2b2b] tracking-tight leading-[0.95] mb-8 text-balance"
          style={{
            fontSize: 'clamp(56px, 9vw, 120px)',
            fontFamily: 'var(--font-satoshi)',
            letterSpacing: '-0.04em',
          }}
        >
          The Certificate<br />
          <em style={{ fontStyle: 'italic', color: '#4f4f4f' }}>Engine.</em>
        </h1>

        <p className="text-[18px] md:text-[22px] text-[#656565] max-w-xl mx-auto leading-relaxed mb-10">
          Pro-grade rendering inside your browser.<br />Drop your dataset. Output perfection.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/canvas" className="cta-primary">
            Start Creating Now
          </Link>
          <a href="#how-it-works" className="cta-secondary">
            See how it works ↓
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main className="bg-[#f0f0f0] text-[#2b2b2b]" style={{ fontFamily: 'var(--font-satoshi)' }}>
      <style>{`
        .mono-label {
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .editorial-heading {
          font-family: var(--font-satoshi);
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.0;
        }
        .nav-label {
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(43,43,43,0.5);
          cursor: default;
          transition: color 0.2s;
        }
        .nav-label:hover { color: rgba(43,43,43,0.9); }
        .nav-btn-outline {
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(43,43,43,0.25);
          color: rgba(43,43,43,0.7);
          transition: all 0.2s;
        }
        .nav-btn-outline:hover {
          border-color: rgba(43,43,43,0.5);
          color: rgba(43,43,43,1);
        }
        .nav-btn-fill {
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          background: #2b2b2b;
          color: #fafafa;
          transition: all 0.2s;
        }
        .nav-btn-fill:hover { background: #1a1a1a; transform: scale(1.02); }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2b2b2b;
          color: #fafafa;
          padding: 14px 32px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.01em;
          transition: all 0.2s;
        }
        .cta-primary:hover { transform: scale(1.04); background: #1a1a1a; }
        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(43,43,43,0.5);
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 500;
          font-size: 14px;
          transition: color 0.2s;
        }
        .cta-secondary:hover { color: rgba(43,43,43,0.9); }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>

      <Nav />
      <Hero />
      <StatsMarquee />
      <StackingCardsSection />
      <CatchphraseSection />
      <HowItWorksSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
