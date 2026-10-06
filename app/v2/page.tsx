import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { HomeRest } from '@/components/sections/HomeRest';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v2)', robots: { index: false } };

/** Previous home (v2): left-aligned hero with the guilloché cropped top-right. Kept for reference. */
export default function HomeV2() {
  return (
    <>
      <Hero />
      <HomeRest />
    </>
  );
}
