import type { Metadata, Viewport } from 'next';
import { Amiri, Tajawal } from 'next/font/google';
import './globals.css';

const amiri = Amiri({ subsets: ['arabic', 'latin'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' });
const tajawal = Tajawal({ subsets: ['arabic', 'latin'], weight: ['300', '400', '500', '700'], variable: '--font-tajawal', display: 'swap' });

export const metadata: Metadata = {
  title: 'المستشارة ليلى الحسيني | محاماة واستشارات قانونية',
  description: 'مكتب ليلى الحسيني للمحاماة والاستشارات القانونية، تمثيل قانوني للأفراد والشركات.',
};

export const viewport: Viewport = { themeColor: '#070b16' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${tajawal.variable}`}>
      <body>{children}</body>
    </html>
  );
}
