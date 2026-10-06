import type { Metadata } from 'next';
import { HeroV6 } from '@/components/sections/HeroV6';
import { HomeRest } from '@/components/sections/HomeRest';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v6)', robots: { index: false } };

/** Home v6: «ruled document with a seal» first screen + «product on stage» Process. */
export default function HomeV6() {
  return (
    <>
      <HeroV6 />
      <HomeRest process="stage" />
    </>
  );
}
