import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import { keywords } from '@/lib/keywords';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Voltfinder - Elektromos autó töltők keresése',
    template: '%s | Voltfinder',
  },
  description:
    'Találd meg a legrelevánsabb elektromos autó töltőket! Valós idejű információk, szűrők és navigáció az EV töltőkhöz.',
  applicationName: 'Voltfinder',
  authors: {
    name: 'Berente Bálint',
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
  openGraph: {
    title: 'Voltfinder - Elektromos autó töltők keresése',
    description:
      'Találd meg a legrelevánsabb elektromos autó töltőket! Valós idejű információk, szűrők és navigáció az EV töltőkhöz.',
    type: 'website',
    siteName: 'Voltfinder',
    locale: 'hu_HU',
    url: 'https://voltfinder.hu',
    countryName: 'Hungary',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Voltfinder - Elektromos autó töltők keresése',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltfinder - Elektromos autó töltők keresése',
    description: 'Találd meg a legrelevánsabb elektromos autó töltőket!',
    images: ['/opengraph-image'],
  },
  manifest: '/manifest.json',
  keywords: keywords,
  metadataBase: new URL('https://voltfinder.hu'),
};

const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={inter.className}>
        {children} <SpeedInsights />
      </body>
      {ANALYTICS_ID && <GoogleAnalytics gaId={ANALYTICS_ID} />}
      <Analytics />
    </html>
  );
}
