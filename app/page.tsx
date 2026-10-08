import type { Metadata } from 'next';
import { HeroFrame } from '@/components/v7/HeroFrame';
import { Home } from '@/components/v7/Home';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия' };

export default function Page() {
  return <Home hero={<HeroFrame />} />;
}
