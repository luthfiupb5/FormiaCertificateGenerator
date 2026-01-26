'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: 'violet' | 'blue' | 'emerald' | 'pink' | 'amber' | 'cyan';
    delay?: string;
    isExternal?: boolean;
}

export default function ProductCard({ title, description, icon, href, color, delay = '', isExternal = false }: ProductCardProps) {
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
        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    };

    const spotlightColors = {
        violet: 'rgba(139, 92, 246, 0.25)',
        blue: 'rgba(59, 130, 246, 0.25)',
        emerald: 'rgba(16, 185, 129, 0.25)',
        pink: 'rgba(236, 72, 153, 0.25)',
        amber: 'rgba(245, 158, 11, 0.25)',
        cyan: 'rgba(6, 182, 212, 0.25)',
    };

    const spotlightColor = spotlightColors[color];
    const LinkComponent = isExternal ? 'a' : Link;
    const linkProps = isExternal ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

    return (
        <LinkComponent
            {...linkProps}
            className={`block h-full group outline-none`}
        >
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`relative h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-${color}-900/10 ${delay}`}
            >
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    }}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 ${colorStyles[color]}`}>
                            {icon}
                        </div>
                        <h3 className="text-3xl font-bold mb-3 text-white">
                            {title}
                        </h3>
                    </div>

                    <div className="relative">
                        {/* Description - Reveals on hover */}
                        <div className="overflow-hidden max-h-0 opacity-0 transition-all duration-500 ease-out group-hover:max-h-40 group-hover:opacity-100 pr-12">
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Arrow Button */}
                        <div className={`absolute bottom-0 right-0 p-3 rounded-full border border-white/10 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110 ${opacity ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                            {isExternal ? <ArrowUpRight className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </div>
        </LinkComponent>
    );
}
