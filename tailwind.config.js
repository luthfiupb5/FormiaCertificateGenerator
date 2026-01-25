/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                surface: 'var(--surface)',
                'surface-hover': 'var(--surface-hover)',
                border: 'var(--border)',
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)',
                },
                'primary-hover': 'var(--primary-hover)',
                secondary: 'var(--secondary)',
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
            },
            fontFamily: {
                sans: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-space)', 'sans-serif'],
            },
            backgroundImage: {
                'dot-pattern': 'radial-gradient(circle, #27272a 1px, transparent 1px)',
            },
            backgroundSize: {
                'dot-pattern': '24px 24px',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'grid-beam': 'grid-beam 20s linear infinite',
                'shimmer': 'shimmer 8s linear infinite',
                'spin-slow': 'spin-slow 12s linear infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                'grid-beam': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' }
                },
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                'marquee': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}
