'use client';

import React, { useRef, useState } from 'react';

export default function ThreeDCard({ children }: { children: React.ReactNode }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');
    const [shineStyle, setShineStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();

        // Further reduced tilt intensity (larger divisor)
        const x = (e.clientX - left - width / 2) / 100;
        const y = (e.clientY - top - height / 2) / 100;

        setTransform(`perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.01, 1.01, 1.01)`);

        // Calculate mouse position in percentage for the shine effect
        const mouseX = ((e.clientX - left) / width) * 100;
        const mouseY = ((e.clientY - top) / height) * 100;

        setShineStyle({
            // Stronger opacity and larger gradient for better visibility
            background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
        });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)');
        setShineStyle({}); // Reset shine
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: 'transform 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)', // Smoother easing
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
            className="w-full h-full relative group/card"
        >
            {children}

            {/* Dynamic Shine Effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl"
                style={{
                    ...shineStyle,
                    zIndex: 10,
                    // Removed mix-blend-overlay to ensure visibility on all backgrounds
                    mixBlendMode: 'soft-light',
                }}
            />
        </div>
    );
}
