'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import { useProgress } from './useProgress';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

const FACTS: [string, string][] = [['10', 'лет в вебе'], ['40+', 'проектов'], ['7 дней', 'от брифа до готового лендинга']];

/** Short facts about sites, each with its source; rotate on their own, pause on hover/focus. */
const WEB_FACTS: { n: string; text: string; src: string }[] = [
  { n: '50 мс', text: 'хватает посетителю, чтобы составить первое впечатление о сайте', src: 'Lindgaard и др., 2006' },
  { n: '94%', text: 'первых впечатлений о сайте связаны с дизайном', src: 'Sillence и др., 2004' },
  { n: '53%', text: 'мобильных посетителей уходят, если страница грузится дольше 3 секунд', src: 'Google' },
  { n: '75%', text: 'людей судят о надёжности компании по её сайту', src: 'Stanford Web Credibility' },
];
const ROTATE = 6000;

function WebFacts() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setTimeout(() => setI((x) => (x + 1) % WEB_FACTS.length), ROTATE);
    return () => clearTimeout(t);
  }, [i, paused]);
  const f = WEB_FACTS[i];
  return (
    <div className={`${s.facts2} ${paused ? s.f2Paused : ''}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <span className={`mono ${s.f2Label}`}>Факт о сайтах · {String(i + 1).padStart(2, '0')}/{String(WEB_FACTS.length).padStart(2, '0')}</span>
      <div key={i} className={s.f2Body} aria-live="polite">
        <b className={s.f2Num}>{f.n}</b>
        <p className={s.f2Text}>{f.text}</p>
        <span className={`mono ${s.f2Src}`}>{f.src}</span>
      </div>
      <div className={s.f2Bars} role="tablist" aria-label="Факты">
        {WEB_FACTS.map((x, k) => (
          <button key={x.n} type="button" role="tab" aria-selected={k === i} aria-label={`Факт ${k + 1}`} className={`${s.f2Bar} ${k === i ? s.f2On : ''} ${k < i ? s.f2Done : ''}`}
            style={{ ['--t' as string]: `${ROTATE}ms` }} onClick={() => setI(k)}>
            {/* the running bar restarts after a pause, in step with the timer */}
            <span key={k === i ? `${i}-${paused}` : k} />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Hero, variant 2 «Окно»: editorial split. Ink title, lead, CTAs and the studio's numbers on paper at the left;
 * the glass loop in a tall rounded window at the right that wipes open on load, with rotating facts about sites on glass.
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
        <WebFacts />
      </div>
    </section>
  );
}
