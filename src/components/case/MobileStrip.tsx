'use client';
import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './Frames';
import s from './Case.module.css';

type Item = { src?: string; label: string };

/** Row of phones (280px; 75% on mobile): native swipe with scroll-snap; mouse drag on desktop. */
export function MobileStrip({ items, caption, hint = 'Листайте →' }: { items: Item[]; caption: React.ReactNode; hint?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [fits, setFits] = useState(false);

  // When every phone fits, the row stretches to full width: no drag, no «Листайте» hint.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.scrollWidth <= el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const down = (e: React.PointerEvent) => {
    if (fits || e.pointerType !== 'mouse' || !ref.current) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft };
    ref.current.style.scrollSnapType = 'none';
    ref.current.style.cursor = 'grabbing';
  };
  const move = (e: React.PointerEvent) => {
    if (drag.current && ref.current) ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const up = () => {
    if (!drag.current || !ref.current) return;
    drag.current = null;
    ref.current.style.cursor = '';
    ref.current.style.scrollSnapType = '';
  };

  return (
    <div>
      <div className={s.padX}>{caption}</div>
      <div ref={ref} className={`${s.strip} ${fits ? s.fits : ''}`} tabIndex={fits ? undefined : 0} role="region" aria-label="Мобильные экраны"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        {items.map((it, i) => (
          <figure key={i} className={s.stripItem}>
            <PhoneFrame src={it.src} alt={it.label} />
            <figcaption className={`${s.mono} ${s.stripCap}`}>{String(i + 1).padStart(2, '0')} · {it.label}</figcaption>
          </figure>
        ))}
        <span aria-hidden="true" className={s.stripEnd} />
      </div>
      {hint && !fits && <div className={`${s.mono} ${s.hint}`}>{hint}</div>}
    </div>
  );
}
