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
  metadataBase: new URL('https://formia.luthfibassam.space'), // Updated with actual domain
  title: {
    default: 'Formia - Certificate Generator',
    template: '%s | Formia',
  },
  description: 'Design certificates, map your data, and generate thousands of PDFs in seconds. The ultimate tool for bulk creativity.',
  keywords: [
    // Core Functionality
    'Certificate Generator', 'Bulk PDF Generator', 'Certificate Maker', 'Diploma Creator', 'Award Generator',
    'Mass Certificate Generation', 'Automated Certificates', 'Dynamic PDF Creation', 'Bulk Document Automation',

    // Features
    'Data Mapping', 'CSV Import', 'Excel to PDF', 'No-code Design Tool', 'Drag and Drop Editor',
    'High Resolution PDF', 'Print Ready Certificates', 'Digital Credentials', 'E-Certificates',
    'Cloud Storage', 'Real-time Preview', 'Template Library', 'Custom Fonts',

    // Use Cases
    'Webinar Certificates', 'Course Completion Certificates', 'Workshop Awards', 'Employee Recognition',
    'Hackathon Certificates', 'Event Participation', 'Training Certifications', 'School Diplomas',
    'Professional Licensing', 'Membership Cards', 'Badge Generator',

    // Marketing / Descriptive
    'Free Certificate Maker', 'Online Certificate Tool', 'Best Certificate Generator', 'Fastest PDF Engine',
    'Premium Design', 'Professional Templates', 'Instant Export', 'Secure Certificate Platform',
    'Design Certificates Online', 'Generate Certificates Free'
  ],
  authors: [{ name: 'Luthfi Bassam U P' }],
  creator: 'Luthfi Bassam U P',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://formia.luthfibassam.space',
    title: 'Formia - Certificate Generator',
    description: 'Design certificates, map your data, and generate thousands of PDFs in seconds.',
    siteName: 'Formia',
    images: [
      {
        url: '/og-image.png', // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: 'Formia - Certificate Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formia - Certificate Generator',
    description: 'Design certificates, map your data, and generate thousands of PDFs in seconds.',
    images: ['/og-image.png'], // Ensure this image exists in public folder
    creator: '@luthfi_bassam', // Replace with actual handle if known
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
    apple: '/apple-touch-icon.png', // Ensure this exists or use favicon
  },
};

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
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
