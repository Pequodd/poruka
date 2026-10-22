import type { Metadata } from 'next';
import { HeroLens } from '@/components/v7/HeroLens';
import { Home } from '@/components/v7/Home';

// Experimental first screen — not linked from the site and not indexed.
export const metadata: Metadata = { title: 'ПОРУКА — хиро, вариант 5', robots: { index: false, follow: false } };

export default function Page() {
  return <Home hero={<HeroLens />} />;
}
