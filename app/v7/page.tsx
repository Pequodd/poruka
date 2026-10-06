import type { Metadata } from 'next';
import { Contact } from '@/components/sections/Contact';
import { ProcessStage } from '@/components/sections/ProcessStage';
import { Team } from '@/components/sections/Team';
import { ClientsV7 } from '@/components/v7/ClientsV7';
import { FaqV7 } from '@/components/v7/FaqV7';
import { FooterV7 } from '@/components/v7/FooterV7';
import { HeroV7 } from '@/components/v7/HeroV7';
import { Look } from '@/components/v7/Look';
import { Orbit } from '@/components/v7/Orbit';
import { ServicesV7 } from '@/components/v7/ServicesV7';
import { StatementV7 } from '@/components/v7/StatementV7';
import { StoriesV7 } from '@/components/v7/StoriesV7';
import { WipeV7 } from '@/components/v7/WipeV7';
import { WorksV7 } from '@/components/v7/WorksV7';
import s from '@/components/v7/V7.module.css';

export const metadata: Metadata = { title: 'ПОРУКА — цифровая студия (v7)', robots: { index: false } };

/**
 * Home v7 (ref: neuracore.uprock.pro): one glass ring travels through the page — it grows behind the glass
 * service cards, holds the pinned works, drifts out of focus behind stories, parks beside the FAQ and becomes
 * the «О» of the footer wordmark. Second accent: ultramarine.
 */
export default function HomeV7() {
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
        <ClientsV7 />
        <div data-orbit="0 0 1 0 0" className={s.solid}><ProcessStage intro="statement" /></div>
        <div data-orbit="0 0 1 0 0" className={s.solid}><Team /></div>
        <FaqV7 />
        <div data-orbit="0 0 1 0 0" className={s.solid}><Contact /></div>
        <FooterV7 />
      </div>
    </div>
  );
}
