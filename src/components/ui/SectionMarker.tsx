'use client';
import { useEffect, useRef, useState } from 'react';
import s from './SectionMarker.module.css';

type Props = { children: React.ReactNode; active?: boolean; onInk?: boolean; className?: string; /** seal dot only while in view */ live?: boolean };

/** 8px dot + mono label. The dot turns seal red while its section is in view. */
export function SectionMarker({ children, active, onInk, className, live = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!live || active === false || !ref.current) return;
    const sec = ref.current.closest('section') || ref.current;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '-20% 0px -20% 0px' });
    io.observe(sec);
    return () => io.disconnect();
  }, [live, active]);
  const on = active !== false && (active || inView);
  return (
    <span ref={ref} className={[s.marker, onInk && s.onInk, on && s.active, className].filter(Boolean).join(' ')}>
      <span aria-hidden="true" className={s.dot} />
      {children}
    </span>
  );
}
