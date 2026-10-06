'use client';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

/** Full-bleed 16:9 cover: wipes in from the bottom (clip-path) and settles from scale 1.15. */
export function CaseCover({ image, title }: { image?: string; title: string }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSeen(true), 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`${s.coverWrap} ${seen ? s.seen : ''}`}>
      <div className={s.coverInner}>
        {image ? <img src={asset(image)} alt={`Обложка — ${title}`} className={s.cover} /> : <Placeholder ratio="auto" label="ОБЛОЖКА 16:9" className={s.phFill} />}
      </div>
    </div>
  );
}
