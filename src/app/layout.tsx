import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voltfinder',
  description: 'Találd meg a legrelevánsabb elektromos autó töltőket!',
  applicationName: 'Voltfinder',
  authors: {
    name: 'Berente Bálint',
  },
  manifest: '/manifest.json',
};

const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={inter.className}>{children}</body>
      {ANALYTICS_ID && <GoogleAnalytics gaId={ANALYTICS_ID} />}
    </html>
  );
}
