'use client';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { Placeholder } from './Placeholder';
import s from './ProjectCard.module.css';

type Props = { title: string; meta?: string; result?: string; ratio?: string; image?: string; href: string };

/** Teaser card: cover zooms 1.04 under a 96px black «Смотреть» cursor. */
export function ProjectCard({ title, meta, result, ratio = '4/5', image, href }: Props) {
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <Link href={href} className={s.card}>
      <div className={s.media} onMouseMove={move}>
        <div className={s.zoom}>
          {image ? <div style={{ aspectRatio: ratio }}><img src={asset(image)} alt="" className={s.img} loading="lazy" /></div> : <Placeholder ratio={ratio} />}
        </div>
        <span className={s.cursor} aria-hidden="true">Смотреть</span>
      </div>
      <div className={s.foot}>
        <div className={s.text}>
          {meta && <span className={s.meta}>{meta}</span>}
          <span className={s.title}>{title}</span>
          {result && <span className={s.result}>{result}</span>}
        </div>
        <span aria-hidden="true" className={s.arrow}>↗</span>
      </div>
    </Link>
  );
}
