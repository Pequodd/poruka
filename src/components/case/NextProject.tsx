'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { useIsMobile, useReducedMotion } from '@/lib/hooks';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

type Props = { title: string; image?: string; href: string; label?: string };

/**
 * Ink «next project». Cover fills the whole section (40%), title + progress line overlaid at the bottom.
 * Desktop: section 150vh, overlay pinned; the line fills with scroll. Navigation on click (contact + footer follow,
 * so no auto-jump): the cover goes to 100% and the next case opens. Mobile / reduced motion: plain block link.
 */
export function NextProject({ title, image, href, label = 'Следующий проект' }: Props) {
  const mobile = useIsMobile();
  const rm = useReducedMotion();
  const pinned = !mobile && !rm;
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [going, setGoing] = useState(false);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
      el.style.setProperty('--p', String(p));
      if (pct.current) pct.current.textContent = `(${Math.round(p * 100)}%)`;
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, [pinned]);

  const go = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setGoing(true);
    setTimeout(() => { router.push(href); window.scrollTo(0, 0); }, rm ? 0 : 700);
  };

  return (
    <section ref={ref} data-ink className={pinned ? s.next : `${s.next} ${s.nextStatic}`} aria-label={label}>
      <div className={`${s.nextCover} ${going ? s.go : ''}`}>
        {image ? <img src={asset(image)} alt="" className={s.cover} loading="lazy" /> : <Placeholder ratio="auto" tone="dark" label="" className={s.phFill} />}
      </div>
      <Link href={href} className={s.nextPin} onClick={go} aria-label={`${label}: ${title}`}>
        <div className={s.nextOverlay}>
          <div className={`${s.mono} ${s.nextRow}`}>
            <span>{label}</span>
            {pinned && <span>(открыть проект ↗)</span>}
          </div>
          <div className={s.nextTitleRow}>
            <span className={s.nextTitle}>{title}</span>
            {pinned ? <span ref={pct} className={s.mono}>(0%)</span> : <span className={s.nextArrow} aria-hidden="true">↗</span>}
          </div>
          {pinned && <div className={s.line}><div className={s.fill} /><span className={s.sealDot} /></div>}
        </div>
      </Link>
    </section>
  );
}
