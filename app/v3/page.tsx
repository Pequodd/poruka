import type { Metadata } from 'next';
import { HeroV3 } from '@/components/sections/HeroV3';
import { HomeRest } from '@/components/sections/HomeRest';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v3)', robots: { index: false } };

/** Home v3: centred hero (guilloché behind glass columns), the rest as on the main home. */
export default function HomeV3() {
  return (
    <>
      <HeroV3 />
      <HomeRest />
    </>
  );
}
