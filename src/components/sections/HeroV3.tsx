'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useOn } from '@/lib/hooks';
import { Guilloche } from './Guilloche';
import s from './HeroV3.module.css';

/** Blur per glass column (px), left → right: irregular on purpose, like ribbed glass. */
const BLUR = [0, 12, 28, 2, 18, 0, 24, 6, 32, 1, 14, 22];

const WORDS: { t: string; grey?: boolean }[] = [
  { t: 'Проектируем' }, { t: 'и запускаем' }, { t: 'сайты,' }, { t: 'за которые', grey: true },
];

const fade = (d: number, y = 16) => ({ ['--fd' as string]: `${d}ms`, ['--fy' as string]: `${y}px` });

/** Home v3 first screen: centred headline over live guilloché seen through glass columns. */
export function HeroV3() {
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const on = useOn(300);
  const latest = PROJECTS[0];
  return (
    <section
      className={`${s.hero} ${on ? s.on : ''}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      }}
    >
      <div className={s.bg}><Guilloche pointer={pointer} className={s.canvas} lineWidth={1.6} alpha={0.65} /></div>
      <div className={s.glass} aria-hidden="true">
        {BLUR.map((b, i) => <span key={i} className={s.col} style={{ ['--b' as string]: `${b}px` }} />)}
      </div>

      <div className={s.inner}>
        <div className={`mono ${s.proof} ${s.fade}`} style={fade(0, 12)}>
          <span className={s.dot} aria-hidden="true" />40+ проектов <b>·</b> 95% клиентов возвращаются
        </div>
        <h1 className={s.h1}>
          {WORDS.map((w, i) => (
            <span key={i}>
              <span className={s.mask}><span className={`${s.word} ${w.grey ? s.grey : ''}`} style={{ ['--d' as string]: `${i * 60}ms` }}>{w.t}</span></span>{' '}
            </span>
          ))}
          <span className={s.mark}>
            <span className={s.mask}><span className={`${s.word} ${s.grey}`} style={{ ['--d' as string]: '240ms' }}>ручаемся.</span></span>
            <span aria-hidden="true" className={s.underline} />
          </span>
        </h1>
        <p className={`${s.lead} ${s.fade}`} style={fade(600)}>
          <b>UI/UX‑дизайн и сайты на WordPress и 1С‑Битрикс.</b> Три человека без менеджеров: вы говорите с теми, кто делает проект.
        </p>
        <div className={`${s.ctaWrap} ${s.fade}`} style={fade(800)}>
          <Link href="/#contact" className={s.cta}>
            <span className={s.ctaIcon} aria-hidden="true">↗</span>
            <span className={s.ctaPill}>Обсудить проект</span>
          </Link>
        </div>
      </div>

      <div className={`mono ${s.corner} ${s.left} ${s.fade}`} style={fade(1100, 0)}>
        <span><b>(Цифровая студия)</b></span>
        <span>Челябинск → мир</span>
      </div>
      <div className={`${s.corner} ${s.right} ${s.fade}`} style={fade(1300, 24)}>
        <div className={`mono ${s.latestLabel}`}><span aria-hidden="true">↗</span><span>Последняя работа</span></div>
        <Link href={caseHref(latest)} className={s.latest}>
          <div className={s.latestMedia}>{latest.image && <img src={asset(latest.image)} alt="" className={s.latestImg} />}</div>
          <div className={s.latestCap}>
            <span className={s.latestTitle}>{latest.title} <span>({latest.year})</span></span>
            <span className={`mono ${s.arr}`} aria-hidden="true">↗</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
