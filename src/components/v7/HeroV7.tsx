'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useProgress } from './useProgress';
import s from './V7.module.css';

/** Letters fly in one by one; each word is a no-wrap group so lines only break between words. */
const Letters = ({ text, from, tail }: { text: string; from: number; tail?: React.ReactNode }) => {
  let i = from;
  const words = text.split(' ');
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className={s.word}>
          {[...w].map((ch, ci) => <span key={ci} className={s.ltr} style={{ ['--i' as string]: i++ }}>{ch}</span>)}
          {wi === words.length - 1 && tail}
        </span>
      ))}
    </>
  );
};

/** v7 hero: giant title assembles letter by letter over the glass links; lead and CTAs sit right under it, mid-screen. */
export function HeroV7() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--hp', Math.max(0, p * 2 - 1).toFixed(3)));
  return (
    <section ref={ref} className={s.hero} data-orbit="0 -4 1.02 0 1" data-orbit-m="0 -10 1.05 0 1">
      <h1 className={s.heroTitle} aria-label="Ручаемся за результат">
        <span className={s.heroL1} aria-hidden="true"><Letters text="Ручаемся" from={0} /></span>
        <span className={s.heroL2} aria-hidden="true"><Letters text="за результат" from={8} tail={<span className={`${s.ltr} ${s.seal}`} style={{ ['--i' as string]: 20 }}>.</span>} /></span>
      </h1>

      <div className={s.heroFoot}>
        <p className={s.heroLead} style={{ ['--d' as string]: '1300ms' }} data-hero>Цифровая студия «Порука». Проектируем и запускаем сайты для малого и среднего бизнеса — от исследования до поддержки.</p>
        <div className={s.heroCta} style={{ ['--d' as string]: '1450ms' }} data-hero>
          <div className={s.heroBtns}>
            <a className={s.ctaMain} href="#contact">Обсудить проект<span className={s.ctaIcon} aria-hidden="true">↗</span></a>
            <Link className={s.ctaInk} href="/portfolio/">Смотреть работы</Link>
          </div>
          <span className={`mono ${s.ctaNote}`}><span className={s.liveDot} aria-hidden="true" />На связи · ответ за день</span>
        </div>
      </div>
      <span className={`mono ${s.scrollHint}`} style={{ ['--d' as string]: '1700ms' }} data-hero>Листайте</span>
    </section>
  );
}
