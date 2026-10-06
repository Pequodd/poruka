'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STEPS } from '@/data/content';
import { Chip } from '../ui/Chip';
import { SectionMarker } from '../ui/SectionMarker';
import { Process3D } from './Process3D';
import s from './Process.module.css';

const N = STEPS.length;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Process v2: section is 8×65vh + 100vh tall, the stage is sticky 100vh.
 * Scroll progress p∈[0,1] → step = floor(p·8). Odometer · 3D morph · step copy · timeline.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [prog, setProg] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (!(span > 0)) return;
      const p = Math.max(0, Math.min(1, -r.top / span));
      setProg(p);
      setStep(Math.max(0, Math.min(N - 1, Math.floor(p * N))));
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, []);

  const jump = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (span * (i + 0.5)) / N;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
  }, []);

  const cur = STEPS[step];
  return (
    <section ref={ref} id="process" className={s.section} aria-label="Процесс" data-ink>
      <div className={s.stage}>
        <div className={`container ${s.top}`}>
          <SectionMarker onInk active>Процесс · Как мы работаем</SectionMarker>
          <span className={`mono ${s.muted}`} aria-live="polite">({pad(step + 1)}/{pad(N)})</span>
        </div>
        <div className={`container ${s.main}`}>
          <div className={s.odoWrap}>
            <div className={s.odo} aria-hidden="true">
              <div className={s.odoTrack} style={{ transform: `translateY(${-step}em)` }}>
                {STEPS.map((_, i) => <div key={i}>{pad(i + 1)}</div>)}
              </div>
            </div>
            <span className={`mono ${s.muted} ${s.odoCap}`}>Этап из {pad(N)} · листайте</span>
            <span className={`mono ${s.muted} ${s.odoTotal}`}>/ {pad(N)}</span>
          </div>
          <div className={s.scene}><Process3D step={step} /></div>
          <div key={step} className={s.copy}>
            <h3 className={`${s.h3} ${s.in}`}>{cur.title}</h3>
            <p className={`${s.desc} ${s.in}`} style={{ animationDelay: '90ms' }}>{cur.description}</p>
            <span className={`mono ${s.in}`} style={{ animationDelay: '160ms' }}>(Срок: {cur.duration})</span>
            <div className={`${s.chips} ${s.in}`} style={{ animationDelay: '220ms' }}>
              {cur.deliverables.map((d) => <Chip key={d} onInk>{d}</Chip>)}
            </div>
          </div>
        </div>
        <div className={`container ${s.timelineWrap}`}>
          <div className={s.timeline} style={{ ['--p' as string]: prog }}>
            <div className={s.line}><div className={s.fill} /><span className={s.dot} /></div>
            <div className={s.steps}>
              {STEPS.map((t, i) => (
                <button key={i} type="button" onClick={() => jump(i)} aria-label={`Этап ${i + 1}: ${t.title}`} aria-current={i === step ? 'step' : undefined}
                  className={`${s.stepBtn} ${i === step ? s.current : i < step ? s.past : ''}`}>
                  <span className="mono">{pad(i + 1)}</span>
                  <span className={s.stepTitle}>{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
