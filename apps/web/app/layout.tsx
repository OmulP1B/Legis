import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './design-system.css';
import './globals.css';

const onest = Onest({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-onest',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Portal Legislativ | Republica Moldova',
    template: '%s | Portal Legislativ',
  },
  description: 'Acces la actele normative oficiale ale Republicii Moldova',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ro_MD',
    siteName: 'Portal Legislativ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={onest.variable}>{children}</body>
    </html>
  );
}
