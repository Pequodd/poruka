import type { Metadata } from 'next';
import { ProcessStage } from '@/components/sections/ProcessStage';
import { ContactV7 } from '@/components/v7/ContactV7';
import { FaqV7 } from '@/components/v7/FaqV7';
import { FooterV7 } from '@/components/v7/FooterV7';
import { HeroV7 } from '@/components/v7/HeroV7';
import { Look } from '@/components/v7/Look';
import { Orbit } from '@/components/v7/Orbit';
import { ServicesV7 } from '@/components/v7/ServicesV7';
import { StatementV7 } from '@/components/v7/StatementV7';
import { StoriesV7 } from '@/components/v7/StoriesV7';
import { TeamV7 } from '@/components/v7/TeamV7';
import { WipeV7 } from '@/components/v7/WipeV7';
import { WorksV7 } from '@/components/v7/WorksV7';
import s from '@/components/v7/V7.module.css';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия' };

/**
 * Home: a looping glass video under the first screen, then a pair of interlocked glass links travels through the page —
 * it grows behind the glass service cards, holds the pinned works, drifts out of focus behind stories, parks beside
 * the FAQ and lies across the footer wordmark. Accents: ultramarine, seal red as a dot.
 */
export default function Home() {
  return (
    <div className={s.page}>
      <Look />
      <Orbit />
      <div className={s.content}>
        <HeroV7 />
        <StatementV7 />
        <ServicesV7 />
        <WorksV7 />
        <WipeV7 />
        <StoriesV7 />
        <div data-orbit="0 0 1 0 0" className={s.solid}><ProcessStage intro="statement" eyebrow="(05) Процесс" look="glass" /></div>
        <TeamV7 />
        <FaqV7 />
        <ContactV7 />
        <FooterV7 />
      </div>
    </div>
  );
}
