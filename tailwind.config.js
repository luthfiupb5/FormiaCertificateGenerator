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
                sans: ['var(--font-sans)'],
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
            },
            keyframes: {
                'grid-beam': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}
