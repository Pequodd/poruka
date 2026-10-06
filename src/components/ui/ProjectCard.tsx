'use client';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { Placeholder } from './Placeholder';
import s from './ProjectCard.module.css';

type Props = { title: string; year?: string; cat?: string; result?: string; ratio?: string; image?: string; href: string };

/**
 * Teaser card: cover zooms 1.04 under a 96px black «Смотреть» cursor.
 * Caption matches the home «Работы» cards: hairline, «Title (year)» left, mono category + ↗ right; result below.
 */
export function ProjectCard({ title, year, cat, result, ratio = '4/5', image, href }: Props) {
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <Link href={href} className={s.card}>
      <div className={s.media} style={{ aspectRatio: ratio }} onMouseMove={move}>
        <div className={s.zoom}>
          {image ? <img src={asset(image)} alt="" className={s.img} loading="lazy" /> : <Placeholder ratio="auto" style={{ height: '100%' }} />}
        </div>
        <span className={s.cursor} aria-hidden="true">Смотреть</span>
      </div>
      <div className={s.foot}>
        <div className={s.caption}>
          <span className={s.title}>{title}{year && <span className={s.year}> ({year})</span>}</span>
          <span className={s.cat}>{cat}<span aria-hidden="true" className={s.arrow}>↗</span></span>
        </div>
        {result && <span className={s.result}>{result}</span>}
      </div>
    </Link>
  );
}
