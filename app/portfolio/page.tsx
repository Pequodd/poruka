import type { Metadata } from 'next';
import { Portfolio } from '@/components/pages/Portfolio';

export const metadata: Metadata = { title: 'Работы — ПОРУКА', description: 'Сайты, интерфейсы и редизайны студии «Порука»: в каждом кейсе — задача, решение и цифры после запуска.' };

export default function Page() {
  return <Portfolio />;
}
