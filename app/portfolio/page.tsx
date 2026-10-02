import type { Metadata } from 'next';
import { Portfolio } from '@/components/pages/Portfolio';

export const metadata: Metadata = { title: 'Работы — ПОРУКА', description: 'Проекты, за которые мы ручаемся. Каждый — с задачей, решением и результатом.' };

export default function Page() {
  return <Portfolio />;
}
