'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { caseHref, catsOf, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useProgress } from '../v7/useProgress';
import v from '../v7/V7.module.css';
import s from './V8.module.css';

const ITEMS = PROJECTS.filter((p) => p.image).slice(0, 5);
const N = ITEMS.length;
const pad = (n: number) => String(n).padStart(2, '0');
const c = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Works + client stories in one pinned block: each case fills the stage as a large window, and its glass card
 * carries the results and the client's words — what used to be the separate «Истории».
 */
export function WorksV8() {
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
  if (!N) return null;
  return (
    <section ref={ref} id="works" className={v.works} style={{ height: `${N * 90 + 100}vh` }} data-orbit="0 6 1.5 0 1" data-orbit-m="0 -4 1.25 0 1" aria-label="Работы">
      <div className={v.wStage}>
        <div className={v.wTop}>
          <span className={`mono ${v.eyebrow}`}>(02) Работы и результаты</span>
          <span className={v.wTopRight}>
            <span key={cur} className={v.wNow} aria-live="polite">{ITEMS[cur].title}<span className="mono">{pad(cur + 1)}/{pad(N)}</span></span>
            <Link href="/portfolio/" className={v.wAll}>Все работы →</Link>
          </span>
        </div>
        {ITEMS.map((p, i) => {
          const [main, ...rest] = p.case.stats;
          const quote = p.case.quote.join('').trim();
          return (
            <div key={p.slug} ref={(el) => { items.current[i] = el; }} className={v.wItem} aria-hidden={i !== cur} data-on={i === cur ? '' : undefined}>
              <div className={v.wCase}>
                <Link href={caseHref(p)} className={v.wShot} tabIndex={i === cur ? 0 : -1} aria-label={`Кейс «${p.title}»`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.image!)} alt="" />
                  <span className={v.wCap}><span>{catsOf(p).join(' · ')} · {p.services}</span><span>[{pad(i + 1)}]</span></span>
                </Link>
                <div className={`${v.glass} ${v.wInfo} ${s.wInfo}`}>
                  <span className={`mono ${v.muted}`}>{p.meta}</span>
                  <h3 className={v.wName}>{p.title}</h3>
                  {main ? <div className={s.mainStat}><b>{main.value}{main.suffix}</b><span>{main.caption}</span></div> : <b className={v.wResult}>{p.result}</b>}
                  {rest.length > 0 && (
                    <div className={s.miniStats}>
                      {rest.slice(0, 2).map((x) => <div key={x.caption}><b>{x.value}{x.suffix}</b><span>{x.caption}</span></div>)}
                    </div>
                  )}
                  {quote && <blockquote className={s.wQuote}>{quote}<cite className="mono">{p.case.author}</cite></blockquote>}
                  <Link href={caseHref(p)} className={v.wLink} tabIndex={i === cur ? 0 : -1}>Читать кейс →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
