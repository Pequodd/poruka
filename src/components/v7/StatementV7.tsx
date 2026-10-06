'use client';
import { useRef } from 'react';
import { useProgress } from './useProgress';
import s from './V7.module.css';

const TEXT = 'Мы — команда из трёх человек. Проектируем и запускаем сайты от исследования до поддержки и отвечаем за результат своим именем.'.split(' ');
const HI = new Set(['своим', 'именем.']);

/** Pinned statement: words come out of blur one by one as you scroll; the glass links drift past, out of focus. */
export function StatementV7() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pin', (p, el) => el.style.setProperty('--sp', Math.min(1, p * 1.25).toFixed(4)));
  return (
    <section ref={ref} className={s.statement} data-orbit="30 -26 0.42 10 0.9" data-orbit-m="28 -30 0.5 8 0.9" aria-label="О студии">
      <div className={s.stStage}>
        <span className={`mono ${s.eyebrow}`}>(00) О нас</span>
        <p className={s.stText}>
          {TEXT.map((w, i) => (
            <span key={i} className={`${s.stW} ${HI.has(w) ? s.ultra : ''}`} style={{ ['--i' as string]: i, ['--n' as string]: TEXT.length }}>{w}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
