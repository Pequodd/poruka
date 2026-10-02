import type { Metadata, Viewport } from 'next';
import { Onest, JetBrains_Mono } from 'next/font/google';
import '@styles/globals.css';
import { HeaderV2 } from '@/components/layout/HeaderV2';

const onest = Onest({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'], variable: '--font-onest', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], weight: ['400'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: 'ПОРУКА — цифровая студия',
  description: 'Проектируем и запускаем сайты, за которые ручаемся. UI/UX-дизайн, WordPress, 1С-Битрикс, разработка с AI.',
};

export const viewport: Viewport = { themeColor: '#F3F3F1', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${jetbrains.variable}`}>
      <body>
        <HeaderV2 />
        <main>{children}</main>
      </body>
    </html>
  );
}
