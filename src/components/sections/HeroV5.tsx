'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useOn, useReducedMotion } from '@/lib/hooks';
import { Button } from '../ui/Button';
import s from './HeroV5.module.css';

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

/**
 * Home v5 first screen — Apple-style reveal: centred headline, the latest work in a browser frame peeks
 * from below and grows to fill the screen while the copy lifts away. Reduced motion: frame shown at full size.
 */
export function HeroV5() {
  const ref = useRef<HTMLElement>(null);
  const on = useOn(150);
  const rm = useReducedMotion();
  const [full, setFull] = useState(false);
  const latest = PROJECTS[0];

  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      const p = rm ? 1 : Math.max(0, Math.min(1, -el.getBoundingClientRect().top / (span * 0.8)));
      el.style.setProperty('--p', p.toFixed(4));
      setFull(p > 0.9);
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, [rm]);

  return (
    <section ref={ref} className={`${s.hero} ${on ? s.on : ''} ${full ? s.p1 : ''}`} aria-label="Порука — цифровая студия">
      <div className={s.stage}>
        <div className={s.copy}>
          <span className={`mono ${s.eyebrow} ${s.fade}`} style={d(0)}><span className={s.dot} aria-hidden="true" />Цифровая студия · Челябинск → мир</span>
          <h1 className={s.h1}>
            <span className={s.line}>
              <span className={s.mask}><span className={s.word} style={d(80)}>Сайты,</span></span>{' '}
              <span className={s.mask}><span className={s.word} style={d(140)}>за&nbsp;которые</span></span>
            </span>
            <span className={`${s.line} ${s.grey}`}>
              <span className={s.mask}><span className={s.word} style={d(200)}>мы</span></span>{' '}
              <span className={s.mark}>
                <span className={s.mask}><span className={s.word} style={d(260)}>ручаемся.</span></span>
                <span aria-hidden="true" className={s.underline} />
              </span>
            </span>
          </h1>
          <p className={`${s.sub} ${s.fade}`} style={d(600)}><b>UI/UX‑дизайн, WordPress и 1С‑Битрикс.</b> Три человека без менеджеров — вы говорите с теми, кто делает проект.</p>
          <div className={`${s.btns} ${s.fade}`} style={d(760)}>
            <Button href="/#contact">Обсудить проект</Button>
            <Button variant="secondary" href="/portfolio/">Смотреть работы</Button>
          </div>
        </div>

        <div className={s.deviceWrap}>
          <div className={s.enter}>
            <div className={s.device}>
              <div className={s.bar} aria-hidden="true"><i /><i /><i /><span className={`mono ${s.url}`}>{latest.case.url}</span></div>
              <div className={s.screen}>
                {latest.image && <img src={asset(latest.image)} alt={`${latest.title} — последняя работа`} className={s.img} />}
                <div className={s.caption}>
                  <Link href={caseHref(latest)} className={s.capLink} tabIndex={full ? 0 : -1}>
                    <span className={s.capTitle}>Последняя работа · {latest.title} <span>({latest.year})</span></span>
                    <span className={s.capArr} aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/portfolio/" className={`mono ${s.capAll}`} tabIndex={full ? 0 : -1}>Все работы ↗</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
