import type { Metadata } from 'next';
import { HeroChain } from '@/components/v7/HeroChain';
import { Home } from '@/components/v7/Home';

// Experimental first screen — not linked from the site and not indexed.
export const metadata: Metadata = { title: 'ПОРУКА — хиро, вариант 6', robots: { index: false, follow: false } };

export default function Page() {
  return <Home hero={<HeroChain />} />;
}
