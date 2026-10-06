'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STEPS } from '@/data/content';
import { useReducedMotion } from '@/lib/hooks';
import { Chip } from '../ui/Chip';
import { SectionMarker } from '../ui/SectionMarker';
import { Process3D } from './Process3D';
import s from './ProcessApple.module.css';

const N = STEPS.length;
const pad = (n: number) => String(n).padStart(2, '0');
const STATEMENT = 'Восемь этапов. Один результат, за который мы ручаемся.'.split(' ');
// Scroll budget, in viewport heights: intro (words light up) → crossfade → 8 steps.
const INTRO = 1, FADE = 0.5, STEP = 0.6;

/**
 * Process — Apple-style. Screen 1: a single statement whose words light up with scroll.
 * Then the statement lifts away and the steps take over: copy first (left, large), the 3D object muted on the right.
 */
export function ProcessApple() {
  const ref = useRef<HTMLElement>(null);
  const rm = useReducedMotion();
  const [step, setStep] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const y = -el.getBoundingClientRect().top;
      const clamp = (v: number) => Math.max(0, Math.min(1, v));
      const intro = rm ? 1 : clamp(y / (INTRO * vh));
      const out = rm ? 1 : clamp((y - INTRO * vh) / (FADE * vh));
      const sp = clamp((y - (INTRO + FADE) * vh) / (N * STEP * vh));
      el.style.setProperty('--intro', intro.toFixed(3));
      el.style.setProperty('--out', out.toFixed(3));
      el.style.setProperty('--sp', sp.toFixed(4));
      setOn(out > 0.5);
      setStep(Math.min(N - 1, Math.floor(sp * N)));
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, [rm]);

  const jump = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (INTRO + FADE + (i + 0.5) * STEP) * vh;
    window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
  }, [rm]);

  const cur = STEPS[step];
  return (
    <section ref={ref} id="process" data-ink className={`${s.section} ${on ? s.on : ''}`} aria-label="Процесс">
      <div className={s.stage}>
        <div className={s.statement} aria-hidden={on}>
          <p className={s.statementText}>
            {STATEMENT.map((w, i) => (
              <span key={i} className={`${s.w} ${w.startsWith('ручаемся') ? s.seal : ''}`} style={{ ['--i' as string]: i, ['--n' as string]: STATEMENT.length }}>{w} </span>
            ))}
          </p>
        </div>

        <div className={s.steps} aria-hidden={!on}>
          <div className={s.scene}><Process3D step={step} muted /></div>
          <div className={`mono ${s.top}`}>
            <SectionMarker onInk active>Процесс · Как мы работаем</SectionMarker>
            <span className={s.muted} aria-live="polite">({pad(step + 1)}/{pad(N)})</span>
          </div>
          <div key={step} className={s.copy}>
            <span className={`mono ${s.count} ${s.in}`}>Этап {pad(step + 1)} из {pad(N)}</span>
            <h3 className={`${s.title} ${s.in}`} style={{ animationDelay: '60ms' }}>{cur.title}</h3>
            <p className={`${s.desc} ${s.in}`} style={{ animationDelay: '140ms' }}>{cur.description}</p>
            <div className={`${s.meta} ${s.in}`} style={{ animationDelay: '220ms' }}>
              <span className="mono">Срок: {cur.duration}</span>
              <span className={s.muted}>·</span>
              {cur.deliverables.map((d) => <Chip key={d} onInk>{d}</Chip>)}
            </div>
          </div>
          <div className={s.progress}>
            <div className={s.line}><div className={s.fill} /><span className={s.dot} /></div>
            <div className={s.nums}>
              {STEPS.map((t, i) => (
                <button key={i} type="button" onClick={() => jump(i)} aria-label={`Этап ${i + 1}: ${t.title}`} aria-current={i === step ? 'step' : undefined}
                  className={`mono ${s.num} ${i === step ? s.current : i < step ? s.past : ''}`}>{pad(i + 1)}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
