import { ProcessStage } from '@/components/sections/ProcessStage';
import { ContactV7 } from './ContactV7';
import { FaqV7 } from './FaqV7';
import { FooterV7 } from './FooterV7';
import { Look } from './Look';
import { Orbit } from './Orbit';
import { ServicesV7 } from './ServicesV7';
import { StatementV7 } from './StatementV7';
import { StoriesV7 } from './StoriesV7';
import { TeamV7 } from './TeamV7';
import { WipeV7 } from './WipeV7';
import { WorksV7 } from './WorksV7';
import s from './V7.module.css';

/**
 * Home: a looping glass video under the first screen, then a pair of interlocked glass links travels through the page —
 * it grows behind the glass service cards, holds the pinned works, drifts out of focus behind stories, parks beside
 * the FAQ and lies across the footer. Accents: ultramarine, seal red as a dot.
 * The hero is a slot so alternative first screens can be compared on their own routes.
 */
export function Home({ hero }: { hero: React.ReactNode }) {
  return (
    <div className={s.page}>
      <Look />
      <Orbit />
      <div className={s.content}>
        {hero}
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
