import type { Metadata } from 'next';
import { ProcessStage } from '@/components/sections/ProcessStage';
import { ContactV7 } from '@/components/v7/ContactV7';
import { FaqV7 } from '@/components/v7/FaqV7';
import { FooterV7 } from '@/components/v7/FooterV7';
import { HeroV7 } from '@/components/v7/HeroV7';
import { Look } from '@/components/v7/Look';
import { Orbit } from '@/components/v7/Orbit';
import { ServicesV7 } from '@/components/v7/ServicesV7';
import { TeamV7 } from '@/components/v7/TeamV7';
import { AboutV8 } from '@/components/v8/AboutV8';
import { PricingV8 } from '@/components/v8/PricingV8';
import { WorksV8 } from '@/components/v8/WorksV8';
import { PROCESS_SHAPES, STEPS_FULL } from '@/data/content';
import s from '@/components/v7/V7.module.css';

// Restructured home for comparison: about + numbers merged, works + stories merged, full-cycle process, prices.
export const metadata: Metadata = { title: 'ПОРУКА — главная, версия 2', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className={s.page}>
      <Look />
      <Orbit />
      <div className={s.content}>
        <HeroV7 />
        <AboutV8 />
        <ServicesV7 />
        <WorksV8 />
        <div data-orbit="0 0 1 0 0" className={s.solid}>
          <ProcessStage intro="statement" eyebrow="(03) Процесс" look="glass" steps={STEPS_FULL} shapes={PROCESS_SHAPES} statement="Шесть этапов — от брифа до поддержки. На каждом понятно, что вы получите и когда." />
        </div>
        <PricingV8 />
        <TeamV7 eyebrow="(05) Команда" />
        <FaqV7 eyebrow="(06) Вопросы" />
        <ContactV7 eyebrow="(07) Контакт" />
        <FooterV7 />
      </div>
    </div>
  );
}
