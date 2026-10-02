'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Works.module.css';

/** Hairline table of all projects; hovering dims other rows and a 320px 16:10 preview follows the cursor. */
export function WorksTable() {
  const [hi, setHi] = useState(-1);
  const prev = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (prev.current) {
      prev.current.style.left = `${e.clientX - r.left}px`;
      prev.current.style.top = `${e.clientY - r.top}px`;
    }
  };
  const p = hi >= 0 ? PROJECTS[hi] : null;
  return (
    <div className={`${s.table} ${hi >= 0 ? s.active : ''}`} onMouseMove={move} onMouseLeave={() => setHi(-1)}>
      <div className={`${s.tHead} mono`}>
        <span>Проект</span><span className={s.tHide}>Услуги</span><span className={s.tHide}>Категория</span><span className={s.right}>Год</span>
      </div>
      {PROJECTS.map((x, i) => (
        <Link key={x.slug} href={caseHref(x)} className={`${s.tRow} ${hi === i ? s.tHi : ''}`} onMouseEnter={() => setHi(i)}>
          <span className={s.tTitle}>{x.title}</span>
          <span className={`${s.tCell} ${s.tHide}`}>{x.services}</span>
          <span className={`${s.tCell} ${s.tHide}`}>{x.cat}</span>
          <span className={`${s.tCell} ${s.right}`}>{x.year}</span>
        </Link>
      ))}
      <div className={s.tEnd} />
      <div ref={prev} className={s.preview} aria-hidden="true">
        {p && (p.image ? <img src={asset(p.image)} alt="" className={s.previewImg} /> : <Placeholder ratio="16/10" label={'ИЗОБРАЖЕНИЕ · ' + p.title.toUpperCase()} />)}
      </div>
    </div>
  );
}
