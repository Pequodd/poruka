'use client';
import { useRef } from 'react';
import { useProgress } from './useProgress';
import s from './V7.module.css';

const c = (v: number) => Math.max(0, Math.min(1, v));

/** Full-bleed ultramarine curtain: wipes in from the right, holds the manifesto, wipes out to the left. */
export function WipeV7() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pin', (p, el) => {
    el.style.setProperty('--wa', c(p / 0.34).toFixed(4));
    el.style.setProperty('--wb', c((p - 0.74) / 0.26).toFixed(4));
    el.style.setProperty('--wm', c((p - 0.2) / 0.5).toFixed(4));
  });
  return (
    <section ref={ref} className={s.wipe} data-orbit="-34 4 0.62 0 1" data-orbit-m="0 26 0.6 0 1" aria-label="Почему мы">
      <div className={s.wipeStage}>
        <span className={`mono ${s.eyebrow} ${s.wipeBehind}`}>(03) Почему мы</span>
        <div className={s.wipePanel} data-ink>
          <div className={s.wipeInner}>
            <span className={`mono ${s.wipeEyebrow}`}>(03) Почему мы</span>
            <p className={s.wipeTitle}>
              <span>Три человека.</span>
              <span>40+ проектов.</span>
              <span>Одна подпись<i className={s.sealDot} aria-hidden="true" /></span>
            </p>
            <div className={s.wipeStats}>
              <div><b>10+</b><span className="mono">лет опыта</span></div>
              <div><b>95%</b><span className="mono">клиентов возвращаются</span></div>
              <div><b>0</b><span className="mono">менеджеров‑посредников</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
