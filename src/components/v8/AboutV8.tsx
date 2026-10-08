'use client';
import { useRef } from 'react';
import { useProgress } from '../v7/useProgress';
import v from '../v7/V7.module.css';
import s from './V8.module.css';

const TEXT = 'Небольшая студия. Дизайнеры и разработчики работают с вами напрямую — от исследования до запуска и поддержки сайта.'.split(' ');
const HI = new Set(['напрямую']);
const FACTS: [string, string][] = [['10 лет', 'делаем сайты'], ['40+', 'проектов запустили'], ['95%', 'клиентов возвращаются']];

/**
 * «О студии» = the former statement + «Почему мы» in one pinned screen: the words come out of blur as you scroll,
 * then the studio's numbers rise under them.
 */
export function AboutV8() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pin', (p, el) => el.style.setProperty('--sp', Math.min(1, p * 1.25).toFixed(4)));
  return (
    <section ref={ref} className={`${v.statement} ${s.about}`} data-orbit="30 -26 0.42 10 0.9" data-orbit-m="28 -30 0.5 8 0.9" aria-label="О студии">
      <div className={v.stStage}>
        <span className={`mono ${v.eyebrow}`}>(00) О студии</span>
        <p className={v.stText}>
          {TEXT.map((w, i) => (
            <span key={i} className={`${v.stW} ${HI.has(w) ? v.ultra : ''}`} style={{ ['--i' as string]: i, ['--n' as string]: TEXT.length }}>{w}</span>
          ))}
        </p>
        <dl className={s.aboutFacts}>
          {FACTS.map(([n, l], i) => (
            <div key={l} className={`${v.glass} ${s.aboutFact}`} style={{ ['--k' as string]: i }}>
              <dt className="visually-hidden">{l}</dt>
              <dd><b>{n}</b><span className="mono">{l}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
