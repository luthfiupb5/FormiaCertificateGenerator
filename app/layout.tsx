import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Formia - The Art of Certification',
  description: 'Design and generate certificates in bulk with precision and style.',
};

import AmbientBackground from '@/components/ui/AmbientBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-black font-sans text-neutral-100 antialiased selection:bg-amber-500/30 selection:text-amber-200 relative`}>
        <AmbientBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
