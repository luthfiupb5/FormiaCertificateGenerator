'use client';

import React, { useRef, useState } from 'react';

interface GlassTiltCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function GlassTiltCard({ children, className = '' }: GlassTiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');
    const [shineStyle, setShineStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();

        // Calculate normalized position (0 to 1)
        const normalizedX = (e.clientX - left) / width;
        const normalizedY = (e.clientY - top) / height;

        // Tilt calculation (range from -5deg to 5deg)
        const tiltX = (0.5 - normalizedY) * 10; // Rotate X-axis based on Y position
        const tiltY = (normalizedX - 0.5) * 10; // Rotate Y-axis based on X position

        setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);

        // Shine effect calculation
        const mouseX = normalizedX * 100;
        const mouseY = normalizedY * 100;

        setShineStyle({
            background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
        });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setShineStyle({ opacity: 0 }); // Hide shine
    };

    const handleMouseEnter = () => {
        setShineStyle(prev => ({ ...prev, opacity: 1 }));
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={`relative overflow-hidden rounded-3xl transition-all duration-200 ease-out ${className}`}
            style={{
                transform,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
        >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 pointer-events-none z-0"></div>

            {/* Shine Overlay */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                    ...shineStyle,
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Content */}
            <div className="relative z-20 h-full w-full">
                {children}
            </div>
        </div>
    );
}
