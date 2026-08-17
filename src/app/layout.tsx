import type { Metadata } from 'next';
import './globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { LiquidBackground } from '@/components/layout/LiquidBackground';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Rimuru Script',
    default: 'Rimuru Script - Visionary Roblox Script Hub',
  },
  description:
    'Discover 100% verified, keyless, and malware-tested Roblox scripts for Blox Fruits, Blade Ball, Fisch, and more on Rimuru Script Hub.',
  keywords: [
    'Rimuru Script',
    'Rimuru Script Hub',
    'Roblox scripts',
    'Blox Fruits script',
    'Blade Ball auto parry',
    'Fisch script',
    'Delta executor',
    'Solara executor',
    'Roblox exploits',
    'Liquid Glass script hub',
  ],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  authors: [{ name: 'Rimuru Security Team' }],
  openGraph: {
    title: 'Rimuru Script - Roblox Script Hub',
    description: '100% verified, keyless, and safe Roblox scripts with an Apple Liquid Glass design system.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        <SmoothScroll>
          <LiquidBackground />
          <div className="flex-1 flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 20, 30, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderRadius: '1.25rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              },
            }}
          />
        </SmoothScroll>
      </body>
    </html>
  );
}
