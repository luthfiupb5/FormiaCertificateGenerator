'use client';

import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }: { children: any }) {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
