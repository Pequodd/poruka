import type { Metadata } from 'next';
import { HeroV4 } from '@/components/sections/HeroV4';
import { HomeRest } from '@/components/sections/HomeRest';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v4)', robots: { index: false } };

/** Home v4: «studio bento» first screen with two 3D objects; the rest as on the main home. */
export default function HomeV4() {
  return (
    <>
      <HeroV4 />
      <HomeRest />
    </>
  );
}
