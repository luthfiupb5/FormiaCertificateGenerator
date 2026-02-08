'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function AnimatedBrand() {
    const container = useRef<HTMLSpanElement>(null);
    const text = "Korae";
    const letters = text.split("");

    useGSAP(() => {
        if (!container.current) return;

        const tl = gsap.timeline();

        // Initial setup for 3D look
        gsap.set('.brand-letter', {
            transformOrigin: "50% 50% -50px",
            transformPerspective: "600px",
        });

        tl.fromTo('.brand-letter',
            {
                opacity: 0,
                rotateX: 110,
                y: 50,
                filter: "blur(10px)",
            },
            {
                rotateX: 0,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.5,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
            }
        ).to('.brand-letter', {
            // Subtle breathing animation
            textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
            color: "#ffffff", // Ensure it goes to pure white or keep gradient? Let's use gradient text in CSS but this might override.
            // Actually, for gradient text to work, color must be transparent.
            // Let's rely on CSS for color and just animate transform/filter.
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut",
            stagger: {
                each: 0.1,
                from: "start"
            }
        }, "-=0.5");

    }, { scope: container });

    return (
        <span ref={container} className="inline-block whitespace-nowrap mr-3 cursor-default">
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className="brand-letter inline-block bg-clip-text text-transparent bg-gradient-to-br from-violet-400 via-white to-blue-400"
                    style={{ willChange: 'transform, opacity, filter' }}
                >
                    {letter}
                </span>
            ))}
        </span>
    );
}
