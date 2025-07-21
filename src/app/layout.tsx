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
  title: 'Voltfinder',
  description: 'Találd meg a legrelevánsabb elektromos autó töltőket!',
  applicationName: 'Voltfinder',
  authors: {
    name: 'Berente Bálint',
  },
  openGraph: {
    title: 'Voltfinder',
    description: 'Találd meg a legrelevánsabb elektromos autó töltőket!',
    type: 'website',
    siteName: 'Voltfinder',
    locale: 'hu_HU',
    url: 'https://voltfinder.hu',
    countryName: 'Hungary',
  },
  manifest: '/manifest.json',
  keywords: keywords,
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
