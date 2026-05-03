import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'LocalConnect - Find Trusted Local Service Workers',
    template: '%s | LocalConnect',
  },
  description: 'Connect with verified plumbers, electricians, maids, and other service professionals in your neighborhood. Book instantly, pay securely.',
  keywords: ['local services', 'plumber', 'electrician', 'maid', 'home services', 'service marketplace'],
  authors: [{ name: 'LocalConnect' }],
  creator: 'LocalConnect',
  metadataBase: new URL('https://localconnect.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://localconnect.com',
    siteName: 'LocalConnect',
    title: 'LocalConnect - Find Trusted Local Service Workers',
    description: 'Connect with verified service professionals in your neighborhood.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LocalConnect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocalConnect - Find Trusted Local Service Workers',
    description: 'Connect with verified service professionals in your neighborhood.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {/* Skip Link for Accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
