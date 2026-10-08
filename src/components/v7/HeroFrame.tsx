'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import { useProgress } from './useProgress';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

const FACTS: [string, string][] = [['10', 'лет в вебе'], ['40+', 'проектов'], ['95%', 'клиентов возвращаются']];

/**
 * Hero, variant 2 «Окно»: editorial split. Ink title, lead, CTAs and the studio's numbers on paper at the left;
 * the glass loop in a tall rounded window at the right that wipes open on load, with the latest case on a glass plate.
 */
export function HeroFrame() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useLoopVideo(video, 'tall');
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--hp', Math.max(0, p * 2 - 1).toFixed(3)));
  const latest = PROJECTS.find((p) => p.image) || PROJECTS[0];

  return (
    <section ref={ref} className={s.frameHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.frameText}>
        <span className={`mono ${v.eyebrow}`} style={{ ['--d' as string]: '150ms' }} data-hero>Студия «Порука» · Челябинск</span>
        <h1 className={s.frameTitle} aria-label="Дизайн и разработка сайтов">
          <span aria-hidden="true"><Letters text="Дизайн" from={0} /></span>
          <span aria-hidden="true"><Letters text="и разработка" from={6} /></span>
          <span aria-hidden="true"><Letters text="сайтов" from={17} tail={<span className={`${v.ltr} ${v.seal}`} style={{ ['--i' as string]: 23 }}>.</span>} /></span>
        </h1>
        <p className={s.frameLead} style={{ ['--d' as string]: '1100ms' }} data-hero>Для малого и среднего бизнеса — от исследования и прототипа до запуска и поддержки. WordPress, 1С‑Битрикс, Next.js.</p>
        <div className={v.heroBtns} style={{ ['--d' as string]: '1250ms' }} data-hero>
          <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
          <Link className={v.ctaInk} href="/portfolio/">Смотреть работы</Link>
        </div>
        <dl className={s.facts} style={{ ['--d' as string]: '1400ms' }} data-hero>
          {FACTS.map(([n, l]) => <div key={l}><dt className="visually-hidden">{l}</dt><dd><b>{n}</b><span>{l}</span></dd></div>)}
        </dl>
      </div>

      <div className={s.window}>
        <div className={s.windowMedia} aria-hidden="true">
          <video ref={video} muted loop playsInline preload="auto" />
        </div>
        <span className={`mono ${s.windowChip}`}><span className={v.liveDot} aria-hidden="true" />На связи · ответ за день</span>
        <Link href={caseHref(latest)} className={s.latest}>
          {latest.image && <img src={asset(latest.image)} alt="" className={s.latestImg} />}
          <span className={s.latestText}>
            <span className="mono">Свежий кейс</span>
            <b>{latest.title}</b>
            <span className={s.latestResult}>{latest.result}</span>
          </span>
          <span className={s.latestArrow} aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
