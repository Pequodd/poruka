'use client';
import { useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

type Props = { before?: string; after?: string; caption: React.ReactNode; labels?: [string, string] };

/** Two screenshots stacked with a vertical wipe: pointer drag (vertical page scroll kept), arrows ±2%, Shift ±10%, Home/End. */
export function BeforeAfter({ before, after, caption, labels = ['Было', 'Стало'] }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const at = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const d: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
    if (e.key in d) { e.preventDefault(); setPos((p) => Math.max(0, Math.min(100, p + d[e.key]))); }
    else if (e.key === 'Home') { e.preventDefault(); setPos(0); }
    else if (e.key === 'End') { e.preventDefault(); setPos(100); }
  };
  const img = (src: string | undefined, label: string, tone: 'light' | 'dark') =>
    src ? <img src={asset(src)} alt={label} draggable={false} className={s.cover} /> : <Placeholder ratio="auto" tone={tone} label={`${label.toUpperCase()} · СКРИНШОТ 1440`} className={s.phFill} />;

  return (
    <div>
      {caption}
      <div ref={box} className={s.ba}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e.clientX); }}
        onPointerMove={(e) => dragging.current && at(e.clientX)}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}>
        <div className={s.baLayer}>{img(after, labels[1], 'light')}</div>
        <div className={s.baLayer} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{img(before, labels[0], 'dark')}</div>
        <span className={`${s.mono} ${s.baTag}`} style={{ left: 12 }}>{labels[0]}</span>
        <span className={`${s.mono} ${s.baTag}`} style={{ right: 12 }}>{labels[1]}</span>
        <div className={s.baLine} style={{ left: `${pos}%` }} />
        <button type="button" role="slider" aria-label="Сравнить: было и стало" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
          className={s.baHandle} style={{ left: `${pos}%` }} onKeyDown={key}>↔</button>
      </div>
    </div>
  );
}
