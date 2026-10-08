import type { Metadata } from 'next';
import { HeroType } from '@/components/v7/HeroType';
import { Home } from '@/components/v7/Home';

// Alternative first screen for comparison — not linked from the site and not indexed.
export const metadata: Metadata = { title: 'ПОРУКА — хиро, вариант 3', robots: { index: false, follow: false } };

export default function Page() {
  return <Home hero={<HeroType />} />;
}
