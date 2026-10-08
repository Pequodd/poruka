'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STEPS, type Step } from '@/data/content';
import { useReducedMotion } from '@/lib/hooks';
import { Chip } from '../ui/Chip';
import { SectionMarker } from '../ui/SectionMarker';
import { Process3D } from './Process3D';
import s from './ProcessStage.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
// Scroll budget in viewport heights: intro (title zoom / statement) → intro out, object in → 8 steps.
const B = 0.6, STEP = 0.7;
const STEPS_DEFAULT = STEPS;
const STATEMENT = 'Восемь этапов. На каждом понятно, что вы получите и когда.';

/**
 * Process v6 — «product on stage»: the muted object rises with the copy centred under it.
 * intro='zoom' — giant title zooms in from blur (v6); intro='statement' — v4 statement whose words light up (main).
 */
export function ProcessStage({ intro = 'zoom', eyebrow, look = 'ink', steps = STEPS, statement = STATEMENT, shapes }: {
  intro?: 'zoom' | 'statement';
  /** v7: plain «(NN) Процесс» label instead of the dot marker */ eyebrow?: string;
  /** 'glass' — v7 skin: paper stage, uppercase type, copy on a glass card, ultramarine accents */ look?: 'ink' | 'glass';
  /** Another set of steps (the section height follows their count) */ steps?: Step[];
  /** Statement intro text */ statement?: string;
  /** Scene layout per step (index into processScene's eight forms); defaults to step i → form i */ shapes?: number[];
}) {
  const STEPS = steps;
  const N = steps.length;
  const words = statement.split(' ');
  const ink = look === 'ink';
  const A = intro === 'statement' ? 1 : 0.8;
  const lead = intro === 'statement' ? 0 : 0.35;
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
      const c = (v: number) => Math.max(0, Math.min(1, v));
      const a = rm ? 1 : c((y + vh * lead) / (A * vh));
      const b = rm ? 1 : c((y - A * vh) / (B * vh));
      const sp = c((y - (A + B) * vh) / (N * STEP * vh));
      el.style.setProperty('--a', a.toFixed(3));
      el.style.setProperty('--b', b.toFixed(3));
      el.style.setProperty('--sp', sp.toFixed(4));
      setOn(b > 0.6);
      setStep(Math.min(N - 1, Math.floor(sp * N)));
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, [rm, A, lead, N]);

  const jump = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (A + B + (i + 0.5) * STEP) * vh, behavior: rm ? 'auto' : 'smooth' });
  }, [rm, A]);

  const cur = STEPS[step];
  return (
    <section ref={ref} id="process" data-ink={ink ? '' : undefined} className={`${s.section} ${ink ? '' : s.glass} ${on ? s.on : ''}`} aria-label="Процесс" style={steps === STEPS_DEFAULT ? undefined : { height: `${(A + B + N * STEP + 0.6) * 100}vh` }}>
      <div className={s.stage}>
        {intro === 'statement' ? (
          <div className={s.statement} aria-hidden={on}>
            <h2 className={s.statementText}>
              {words.map((w, i) => (
                <span key={i} className={`${s.w} ${i === words.length - 1 ? s.sealWord : ''}`} style={{ ['--i' as string]: i, ['--n' as string]: words.length }}>{w} </span>
              ))}
            </h2>
          </div>
        ) : (
          <div className={s.title} aria-hidden={on}>
            <h2 className={s.titleText}>Как мы<br />работаем<span>.</span></h2>
          </div>
        )}

        <div className={s.group} aria-hidden={!on}>
          <div className={s.scene}><Process3D step={shapes ? shapes[step] : step} muted palette={ink ? 'default' : 'glass'} /></div>
          <div key={step} className={s.copy}>
            <span className={`mono ${s.eyebrow} ${s.in}`}>Этап {pad(step + 1)} из {pad(N)} · {cur.duration}</span>
            <h3 className={`${s.stepTitle} ${s.in}`} style={{ animationDelay: '60ms' }}>{cur.title}</h3>
            <p className={`${s.desc} ${s.in}`} style={{ animationDelay: '140ms' }}>{cur.description}</p>
            <div className={`${s.chips} ${s.in}`} style={{ animationDelay: '220ms' }}>{cur.deliverables.map((d) => <Chip key={d} onInk={ink}>{d}</Chip>)}</div>
          </div>
        </div>

        <div className={s.layer} aria-hidden={!on}>
          <div className={`mono ${s.top}`}>
            {eyebrow ? <span className={s.muted}>{eyebrow}</span> : <SectionMarker onInk active>Процесс</SectionMarker>}
            <span className={s.muted} aria-live="polite">({pad(step + 1)}/{pad(N)})</span>
          </div>
          <div className={s.dots} role="group" aria-label="Этапы">
            {STEPS.map((t, i) => (
              <button key={i} type="button" onClick={() => jump(i)} aria-label={`Этап ${i + 1}: ${t.title}`} aria-current={i === step ? 'step' : undefined}
                className={`${s.dotBtn} ${i === step ? s.current : i < step ? s.past : ''}`}><span className={s.dot} /></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
