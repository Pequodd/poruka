import type { Metadata, Viewport } from 'next';
import '@fontsource/onest/400.css';
import '@fontsource/onest/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '@styles/globals.css';
import { HeaderV2 } from '@/components/layout/HeaderV2';

export const metadata: Metadata = {
  title: 'ПОРУКА — цифровая студия',
  description: 'Студия «Порука»: проектируем, разрабатываем и поддерживаем сайты для малого и среднего бизнеса. UI/UX‑дизайн, WordPress, 1С‑Битрикс, разработка с AI.',
};

export const viewport: Viewport = { themeColor: '#F3F3F1', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <HeaderV2 />
        <main>{children}</main>
      </body>
    </html>
  );
}
