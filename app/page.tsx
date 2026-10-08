import type { Metadata } from 'next';
import { HeroV7 } from '@/components/v7/HeroV7';
import { Home } from '@/components/v7/Home';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия' };

export default function Page() {
  return <Home hero={<HeroV7 />} />;
}
