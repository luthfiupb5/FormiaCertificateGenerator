import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from "@vercel/analytics/next"
import './globals.css';
import JsonLd from '@/components/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

const satoshi = localFont({
  src: [
    { path: '../public/assets/Satoshi-Light.otf', weight: '300', style: 'normal' },
    { path: '../public/assets/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/assets/Satoshi-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/assets/Satoshi-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/assets/Satoshi-Black.otf', weight: '900', style: 'normal' },
    { path: '../public/assets/Satoshi-LightItalic.otf', weight: '300', style: 'italic' },
    { path: '../public/assets/Satoshi-Italic.otf', weight: '400', style: 'italic' },
    { path: '../public/assets/Satoshi-MediumItalic.otf', weight: '500', style: 'italic' },
    { path: '../public/assets/Satoshi-BoldItalic.otf', weight: '700', style: 'italic' },
    { path: '../public/assets/Satoshi-BlackItalic.otf', weight: '900', style: 'italic' },
  ],
  variable: '--font-jakarta' // Keeping same variable name to avoid breaking tailwind config
});


export const metadata: Metadata = {
  metadataBase: new URL('https://korae.watermelonbranding.in'),
  title: {
    default: 'Korae | Free Bulk Certificate Generator & Design Tool',
    template: '%s | Korae',
  },
  description: 'The fastest way to generate thousands of certificates. Drag & drop CSV/Excel, design with our visual editor, and export PDF/JPG in seconds. No signup required for basic use.',
  keywords: [
    // Core Primary
    'Certificate Generator', 'Bulk Certificate Maker', 'Certificate Design Tool', 'Free Certificate Creator', 'Award Generator', 'Diploma Maker',

    // Feature Specific
    'Bulk PDF Generation', 'CSV to Certificate', 'Excel to PDF Certificate', 'Google Sheets to Certificate', 'Mail Merge Certificates',
    'Dynamic Image Insertion', 'QR Code Certificate', 'Custom Fonts Certificate', 'High Resolution PDF Export',

    // Usage / Intent
    'Generate certificates in bulk free', 'Automate certificate issuance', 'Mass create credentials', 'Digital badges maker',
    'Print ready certificate generator', 'No-code certificate tool',

    // Audience / Niche
    'Certificates for webinars', 'Course completion certificates', 'Workshop participant certificates',
    'Employee recognition awards', 'Hackathon participation certificates', 'School achievement certificates',
    'Sports participation awards', 'Volunteer appreciation certificates',

    // Tech / Platform
    'Online certificate maker', 'Browser based certificate tool', 'Secure certificate generation', 'Cloud certificate storage'
  ],
  authors: [{ name: 'Luthfi Bassam U P' }],
  creator: 'Korae Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://korae.watermelonbranding.in',
    title: 'Korae - Bulk Certificate Generator',
    description: 'Design, map data, and generate 1000s of certificates in seconds. The professional choice for event organizers and educators.',
    siteName: 'Korae',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Korae Interface Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korae - Bulk Certificate Engine',
    description: 'Stop using mail merge. Use Korae to generate beautiful certificates at warp speed.',
    images: ['/og-image.png'],
    creator: '@luthfi_bassam',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import SmoothScroll from '@/components/SmoothScroll';
import InteractiveBackground from '@/components/InteractiveBackground';
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${satoshi.variable} font-sans antialiased`}
      >
        <SmoothScroll>
          <CustomCursor />
          <InteractiveBackground />
          <JsonLd />
          {children}
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  );
}
