'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { prefersReducedMotion } from '@/lib/hooks';
import { Button } from '../ui/Button';
import { Placeholder } from '../ui/Placeholder';
import { SectionMarker } from '../ui/SectionMarker';
import { WorksTable } from './WorksTable';
import s from './Works.module.css';

/** Image that wipes in from the bottom (clip-path) and settles from 1.15 scale when 10% in view. */
function RevealImg({ image, ratio, hover, dim, rowClass }: { image?: string; ratio: string; hover: boolean; dim: boolean; rowClass: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setSeen(true); return; }
    const el = ref.current;
    if (!el) return;
    let done = false;
    const ok = () => { if (done) return; done = true; setSeen(true); cleanup(); };
    const chk = () => { if (el.getBoundingClientRect().top < window.innerHeight * 0.9) ok(); };
    window.addEventListener('scroll', chk, { passive: true });
    const io = new IntersectionObserver(([e]) => e.isIntersecting && ok(), { threshold: 0.1 });
    io.observe(el);
    const t = setTimeout(ok, 1500);
    const cleanup = () => { window.removeEventListener('scroll', chk); io.disconnect(); clearTimeout(t); };
    chk();
    return cleanup;
  }, []);
  return (
    <div ref={ref} className={[s.reveal, rowClass, seen && s.seen, hover && s.hover, dim && s.dim].filter(Boolean).join(' ')} style={{ ['--ratio' as string]: ratio }}>
      <div className={s.layer}>
        {image ? <img src={asset(image)} alt="" className={s.img} loading="lazy" /> : <Placeholder ratio="auto" label="ИЗОБРАЖЕНИЕ" style={{ height: '100%' }} />}
      </div>
    </div>
  );
}

const LAYOUT: [string, string, string][] = [
  [s.c0, s.r1, '16/10'], [s.c1, s.r1, '4/5'], [s.c2, s.r2, '3/4'], [s.c3, s.r2, '3/4'], [s.c4, s.r2, '3/4'],
];

/** Works — variant B: grid-locked rows with shared heights, hairline captions, hover dims siblings. */
export function Works() {
  const [hi, setHi] = useState(-1);
  return (
    <section className={s.section} id="works">
      <div className="container">
        <div className={s.head}>
          <div className={s.marker}><SectionMarker>Работы</SectionMarker></div>
          <h2 className={s.h2}>Проекты, за&nbsp;которые<br /><span className="secondary">мы&nbsp;ручаемся</span><sup className={s.count}>({String(PROJECTS.length).padStart(2, '0')})</sup></h2>
          <Link href="/portfolio/" className={`mono ${s.all}`}>Все работы ↗</Link>
        </div>
        <div className={s.grid}>
          {LAYOUT.map(([col, row, ratio], i) => {
            const p = PROJECTS[i];
            return (
              <Link key={p.slug} href={caseHref(p)} className={`${s.card} ${col}`} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)} onFocus={() => setHi(i)} onBlur={() => setHi(-1)}>
                <RevealImg image={p.image} ratio={ratio} rowClass={row} hover={hi === i} dim={hi !== -1 && hi !== i} />
                <div className={s.caption}>
                  <span className={s.title}>{p.title} <span className={s.year}>({p.year})</span></span>
                  <span className={`mono ${s.cat}`}>{p.cat}<span className={s.arr} aria-hidden="true">↗</span></span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className={s.tableWrap}><WorksTable /></div>
        <div className={s.mobileAll}><Button variant="secondary" fullWidth href="/portfolio/">Все работы</Button></div>
      </div>
    </section>
  );
}
