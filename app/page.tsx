import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden selection:bg-primary/30">

      {/* Background Ambience */}
      {/* Background Ambience & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Moving Beam */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.05),transparent)] h-[200%] animate-grid-beam pointer-events-none" />

        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-primary/20 blur-[100px] opacity-50 animate-pulse-slow" />

        {/* Bottom Ambient */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] rounded-full bg-secondary/10 blur-[120px] opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            F
          </div>
          <span className="text-2xl font-bold tracking-tighter">Formia</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <Link href="/auth/login" className="btn btn-secondary rounded-full px-6">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-3 h-3" />
          <span>The Future of Certificate Automation</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mx-auto mb-8 bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Certificates Generated <br /> in <span className="text-secondary inline-block animate-bounce-slow">Seconds</span>.
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Stop manually editing names. Upload your design, map your data, and generate thousands of premium certificates instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            href="/canvas"
            className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-white/10"
          >
            Automate Certificates <ArrowRight className="w-4 h-4 text-black" />
          </Link>
          <button className="h-12 px-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium flex items-center gap-2">
            View Demo
          </button>
        </div>

        {/* Trust/Social Proof */}
        <div className="mt-20 pt-10 border-t border-white/5 w-full max-w-4xl animate-in fade-in duration-1000 delay-500">
          <p className="text-xs text-neutral-600 uppercase tracking-widest mb-6 font-semibold">Trusted by Innovative Teams</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos */}
            <div className="flex items-center gap-2 text-xl font-bold font-serif"><Zap className="w-6 h-6" /> Acme Corp</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono">■ Bolt</div>
            <div className="flex items-center gap-2 text-xl font-bold font-sans">▲ Vercel</div>
            <div className="flex items-center gap-2 text-xl font-bold">● Stripe</div>
          </div>
        </div>
      </main>
    </div>
  );
}
