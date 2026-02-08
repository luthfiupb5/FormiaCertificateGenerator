'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero3D() {
    const container = useRef<HTMLDivElement>(null);
    const cardMain = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = React.useState(0);

    useGSAP(() => {
        // Scroll Progress Logic
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const val = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

            // Direct DOM update for smooth bar (bypassing React render for width)
            if (progressBarRef.current) {
                gsap.to(progressBarRef.current, {
                    width: `${val}%`,
                    duration: 0.1, // Small smoothing
                    ease: "none"
                });
            }

            setProgress(val);
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Init

        if (!container.current || !cardMain.current) return;
        // ... (rest of simple code) ...
        <div className="space-y-3">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    ref={progressBarRef}
                    className="h-full bg-violet-500 rounded-full"
                ></div>
            </div>
            <div className="flex justify-between text-xs text-neutral-400 font-mono">
                <span>PROCESSING</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>

        // Initial entrance
        const tl = gsap.timeline();
        tl.fromTo(cardMain.current,
            { opacity: 0, y: 100, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }
        );

        // Continuous Floating (Subtle & Safe)
        gsap.to(cardMain.current, {
            y: -8, // Move UP slightly
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        return () => window.removeEventListener('scroll', updateProgress);

    }, { scope: container });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardMain.current || !contentRef.current) return;

        const { clientX, clientY } = e;
        const rect = container.current?.getBoundingClientRect();
        if (!rect) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Tilt
        const rotateY = ((x - centerX) / centerX) * 5;  // Tilt

        // Main Card Rotation
        gsap.to(cardMain.current, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: "power2.out"
        });

        // Parallax Content (Reduced movement)
        gsap.to(contentRef.current, {
            x: -rotateY * 0.5, // Reduced from 1.5
            y: rotateX * 0.5,  // Reduced from 1.5 to prevent content clipping
            duration: 0.5,
            ease: "power2.out"
        });

        // Dynamic Glow
        if (glowRef.current) {
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
            gsap.to(glowRef.current, {
                background: `linear-gradient(${angle}deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`,
                duration: 0.2
            });
        }
    };

    const handleMouseLeave = () => {
        // Reset everything
        gsap.to(cardMain.current, { rotationX: 0, rotationY: 0, duration: 1, ease: "power3.out" });
        gsap.to(contentRef.current, { x: 0, y: 0, duration: 1, ease: "power3.out" });
    };

    return (
        <div
            ref={container}
            className="relative flex items-center justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative w-[340px] md:w-[480px] h-[160px] transform-style-3d preserve-3d">

                {/* Main Card */}
                <div
                    ref={cardMain}
                    className="absolute inset-0 rounded-[24px] bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] transform-style-3d overflow-hidden group z-10"
                >
                    {/* Dynamic Glare Layer */}
                    <div ref={glowRef} className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-30 transition-opacity duration-300"></div>

                    {/* Animated Gradient Background - Subtle */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 opacity-50 animate-gradient-xy"></div>

                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {/* Internal Content Container (Parallax) */}
                    <div ref={contentRef} className="relative z-10 h-full flex items-center px-8 gap-6 transform-style-3d">

                        {/* Logo Badge */}
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20 transform translate-z-[30px] border border-white/20">
                            <span className="font-heading font-bold text-2xl text-white">L</span>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 transform translate-z-[20px]">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-xl font-heading font-bold text-white leading-tight">
                                    Mass Generation
                                </h3>
                                <span className="text-xs font-mono text-neutral-400">ID: XJ-92</span>
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                                    <span>Processing Certificates</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        ref={progressBarRef}
                                        className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full shadow-[0_0_10px_2px_rgba(139,92,246,0.3)]"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Status Light */}
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_2px_rgba(34,197,94,0.4)] transform translate-z-[20px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
