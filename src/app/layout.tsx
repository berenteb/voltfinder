import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
