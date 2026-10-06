import type { Metadata } from 'next';
import { HeroV5 } from '@/components/sections/HeroV5';
import { HomeRest } from '@/components/sections/HomeRest';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v5)', robots: { index: false } };

/** Home v5: Apple-style first screen (the latest work grows to full screen) + Apple-style Process. */
export default function HomeV5() {
  return (
    <>
      <HeroV5 />
      <HomeRest process="apple" />
    </>
  );
}
