import type { Metadata } from 'next';
import { Preview } from '@/components/admin/Preview';

export const metadata: Metadata = { title: 'Предпросмотр кейса — ПОРУКА', robots: { index: false, follow: false } };

export default function Page() {
  return <Preview />;
}
