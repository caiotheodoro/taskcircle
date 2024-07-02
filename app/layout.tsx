import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import Nav from '@/components/organisms/nav';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/query-provider';

import './globals.css';

interface LayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="p-4 lg:px-20  xl:px-32 sm:px-12 md:px-16 2xl:px-64">
          <Providers>
            <Nav />
            {children}
            <Toaster />
          </Providers>
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL('https://taskcircle.vercel.app'),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: 'Task circle',
    template: '%s | Task circle',
  },
  description: 'Task management tool!',
  openGraph: {
    title: {
      template: `%s — Task circle`,
      default: 'Task circle',
    },
    description: 'Task management tool!',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/social.png',
        width: 1200,
        height: 630,
        alt: 'Task circle',
      },
    ],
    siteName: 'Task circle',
  },
  alternates: {
    canonical: '/',
  },
};
