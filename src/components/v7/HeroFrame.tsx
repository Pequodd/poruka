'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import { useProgress } from './useProgress';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

const FACTS: [string, string][] = [['10', 'лет в вебе'], ['40+', 'проектов'], ['7 дней', 'от брифа до готового лендинга']];

type Opt = { label: string; lo: number; hi: number };
/** Rough timing model in days: base by site type + design from scratch + integrations (landing adds less). */
const KIND: Opt[] = [{ label: 'Лендинг', lo: 7, hi: 10 }, { label: 'Корпоративный', lo: 42, hi: 56 }, { label: 'Каталог / магазин', lo: 56, hi: 84 }];
const EXTRA = (kind: number) => ({
  design: [{ label: 'По готовому стилю', lo: 0, hi: 0 }, { label: 'С нуля', ...(kind ? { lo: 7, hi: 14 } : { lo: 3, hi: 5 }) }],
  integr: [{ label: 'Не нужны', lo: 0, hi: 0 }, { label: 'Нужны', ...(kind ? { lo: 14, hi: 21 } : { lo: 3, hi: 5 }) }],
});
const plural = (n: number, one: string, few: string, many: string) => (n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many);
function span(lo: number, hi: number) {
  if (hi <= 21) return `${lo}–${hi} ${plural(hi, 'день', 'дня', 'дней')}`;
  const a = Math.round(lo / 7), b = Math.round(hi / 7);
  return `${a}–${b} ${plural(b, 'неделя', 'недели', 'недель')}`;
}

/** «Сколько займёт ваш сайт?» — three taps over the glass loop give a rough timeline and lead to the contact. */
function Estimator() {
  const [kind, setKind] = useState(0);
  const [design, setDesign] = useState(0);
  const [integr, setIntegr] = useState(0);
  const ex = EXTRA(kind);
  const lo = KIND[kind].lo + ex.design[design].lo + ex.integr[integr].lo;
  const hi = KIND[kind].hi + ex.design[design].hi + ex.integr[integr].hi;
  const rows: [string, Opt[], number, (i: number) => void][] = [
    ['Что делаем', KIND, kind, setKind],
    ['Дизайн', ex.design, design, setDesign],
    ['Интеграции с 1С, CRM', ex.integr, integr, setIntegr],
  ];
  return (
    <div className={s.est}>
      <p className={s.estTitle}>Сколько займёт ваш сайт?</p>
      {rows.map(([label, opts, cur, set]) => (
        <div key={label} className={s.estRow} role="radiogroup" aria-label={label}>
          <span className={`mono ${s.estLabel}`}>{label}</span>
          <div className={s.estOpts}>
            {opts.map((o, i) => (
              <button key={o.label} type="button" role="radio" aria-checked={cur === i} className={`${s.estOpt} ${cur === i ? s.estOn : ''}`} onClick={() => set(i)}>{o.label}</button>
            ))}
          </div>
        </div>
      ))}
      <div className={s.estResult} aria-live="polite">
        <span className={`mono ${s.estLabel}`}>Примерно</span>
        <b key={`${lo}-${hi}`} className={s.estValue}>≈ {span(lo, hi)}</b>
        <a href="#contact" className={s.estCta}>Обсудить проект <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

/**
 * Hero, variant 2 «Окно»: editorial split. Ink title, lead, CTAs and the studio's numbers on paper at the left;
 * the glass loop in a tall rounded window at the right that wipes open on load, with a timing estimator on glass.
 */
export function HeroFrame() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useLoopVideo(video, 'tall');
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--hp', Math.max(0, p * 2 - 1).toFixed(3)));

  return (
    <section ref={ref} className={s.frameHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.frameText}>
        <h1 className={s.frameTitle} aria-label="Дизайн и разработка сайтов">
          <span aria-hidden="true"><Letters text="Дизайн" from={0} /></span>
          <span aria-hidden="true"><Letters text="и разработка" from={6} /></span>
          <span aria-hidden="true"><Letters text="сайтов" from={17} tail={<span className={`${v.ltr} ${v.seal}`} style={{ ['--i' as string]: 23 }}>.</span>} /></span>
        </h1>
        <p className={s.frameLead} style={{ ['--d' as string]: '1100ms' }} data-hero>Для малого и среднего бизнеса — от исследования и прототипа до запуска и поддержки. WordPress, 1С‑Битрикс, Next.js.</p>
        <div className={v.heroBtns} style={{ ['--d' as string]: '1250ms' }} data-hero>
          <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
          <Link className={v.ctaInk} href="/portfolio/">Смотреть кейсы</Link>
        </div>
        <dl className={s.facts} style={{ ['--d' as string]: '1400ms' }} data-hero>
          {FACTS.map(([n, l]) => <div key={l}><dt className="visually-hidden">{l}</dt><dd><b>{n}</b><span>{l}</span></dd></div>)}
        </dl>
      </div>

      <div className={s.window}>
        <div className={s.windowMedia} aria-hidden="true">
          <video ref={video} muted loop playsInline preload="auto" />
        </div>
        <Estimator />
      </div>
    </section>
  );
}
