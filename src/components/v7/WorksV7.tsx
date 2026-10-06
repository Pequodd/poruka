'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useProgress } from './useProgress';
import s from './V7.module.css';

const ITEMS = PROJECTS.filter((p) => p.image).slice(0, 5);
const N = ITEMS.length;
const pad = (n: number) => String(n).padStart(2, '0');
const c = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Pinned works, case-first: each project fills the stage as a large window (title above it, a glass result card
 * on its corner). The next case slides in from the right and grows into place; the current one recedes to the left
 * out of focus. The glass seal hangs behind and peeks around the window.
 */
export function WorksV7() {
  const ref = useRef<HTMLElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const [cur, setCur] = useState(0);
  useProgress(ref, 'pin', (p0, el) => {
    const p = p0 * N;
    el.style.setProperty('--wp', p0.toFixed(4));
    items.current.forEach((it, i) => {
      if (!it) return;
      const t = p - i;
      it.style.setProperty('--in', (i === 0 ? 1 : c((t + 0.3) / 0.38)).toFixed(3));
      it.style.setProperty('--out', (i === N - 1 ? 0 : c((t - 0.68) / 0.32)).toFixed(3));
    });
    setCur(Math.min(N - 1, Math.floor(p + 0.15)));
  });
  return (
    <section ref={ref} id="works" className={s.works} style={{ height: `${N * 90 + 100}vh` }} data-orbit="0 6 1.5 0 1" data-orbit-m="0 -4 1.25 0 1" aria-label="Работы">
      <div className={s.wStage}>
        <div className={s.wTop}>
          <span className={`mono ${s.eyebrow}`}>(02) Работы</span>
          <span className={`mono ${s.eyebrow}`} aria-live="polite">{pad(cur + 1)}/{pad(N)}</span>
        </div>
        {ITEMS.map((p, i) => (
          <div key={p.slug} ref={(el) => { items.current[i] = el; }} className={s.wItem} aria-hidden={i !== cur} data-on={i === cur ? '' : undefined}>
            <h3 className={s.wTitle}>{p.title}</h3>
            <div className={s.wCase}>
              <Link href={caseHref(p)} className={s.wShot} tabIndex={i === cur ? 0 : -1} aria-label={`Кейс «${p.title}»`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(p.image!)} alt="" />
                <span className={s.wCap}><span>{p.cat} · {p.services}</span><span>[{pad(i + 1)}]</span></span>
              </Link>
              <div className={`${s.glass} ${s.wInfo}`}>
                <span className={`mono ${s.muted}`}>{p.meta}</span>
                <b className={s.wResult}>{p.result}</b>
                <p className={s.wText}>{p.case.oneLiner}</p>
                <Link href={caseHref(p)} className={s.wLink} tabIndex={i === cur ? 0 : -1}>Смотреть кейс →</Link>
              </div>
            </div>
          </div>
        ))}
        <div className={s.wProg} aria-hidden="true">
          <span className={s.wBar} />
          {ITEMS.map((p, i) => <span key={p.slug} className={`${s.wDot} ${i <= cur ? s.wDotOn : ''}`} style={{ left: `${(i / (N - 1)) * 100}%` }} />)}
        </div>
        <Link href="/portfolio/" className={`${s.glass} ${s.wAll}`}>Все работы →</Link>
      </div>
    </section>
  );
}
