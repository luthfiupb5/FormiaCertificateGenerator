import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';

function AnchorScroll() {
    const lenis = useLenis();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            // Only interfere if the target exists
            const id = href.substring(1);
            const element = document.getElementById(id);

            if (element) {
                e.preventDefault();
                lenis?.scrollTo(element, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [lenis]);

    return null;
}

export default function SmoothScroll({ children }: { children: any }) {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            <AnchorScroll />
            {children}
        </ReactLenis>
    );
}
