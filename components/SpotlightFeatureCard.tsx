'use client';

import React, { useRef, useState } from 'react';

interface SpotlightFeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: 'violet' | 'blue' | 'emerald' | 'pink' | 'amber' | 'cyan';
    delay: string;
}

export default function SpotlightFeatureCard({ icon, title, description, color, delay }: SpotlightFeatureCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const colorStyles = {
        violet: 'bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20',
        blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
        pink: 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20',
        amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20',
    };

    const spotlightColors = {
        violet: 'rgba(139, 92, 246, 0.25)', // violet-500
        blue: 'rgba(59, 130, 246, 0.25)',   // blue-500
        emerald: 'rgba(16, 185, 129, 0.25)', // emerald-500
        pink: 'rgba(236, 72, 153, 0.25)',    // pink-500
        amber: 'rgba(245, 158, 11, 0.25)',   // amber-500
        cyan: 'rgba(6, 182, 212, 0.25)',     // cyan-500
    };

    const spotlightColor = spotlightColors[color];

    const bgColors = {
        violet: 'bg-violet-500/5 hover:bg-violet-500/10',
        blue: 'bg-blue-500/5 hover:bg-blue-500/10',
        emerald: 'bg-emerald-500/5 hover:bg-emerald-500/10',
        pink: 'bg-pink-500/5 hover:bg-pink-500/10',
        amber: 'bg-amber-500/5 hover:bg-amber-500/10',
        cyan: 'bg-cyan-500/5 hover:bg-cyan-500/10',
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-3xl border border-white/10 p-6 transition-all duration-500 group hover:-translate-y-1 ${delay} h-[240px] flex flex-col justify-between ${bgColors[color]}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Icon - Always visible, subtle glow */}
                <div className={`absolute top-0 right-0 ${colorStyles[color].split(' ')[1]}`}>
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorStyles[color].split(' ')[1]}`}>
                        {icon}
                    </div>
                </div>

                {/* Title & Description Container */}
                <div className="mt-auto">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                        {title}
                    </h3>

                    {/* Description - Reveals on hover */}
                    <div className="overflow-hidden max-h-0 opacity-0 transition-all duration-500 ease-out group-hover:max-h-40 group-hover:opacity-100">
                        <p className="text-sm text-neutral-400 leading-relaxed pb-1">
                            {description}
                        </p>
                    </div>

                    {/* Collapsed State Indicator (Arrow) - Fades out on hover */}
                    <div className="absolute bottom-0 right-0 opacity-100 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none">
                        <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
