'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CONTACTS as C, NAV } from '@/data/content';
import { prefersReducedMotion } from '@/lib/hooks';
import s from './V7.module.css';

/** The glass links lying across the footer wordmark — their own canvas, mounted when the footer nears view. */
function MiniOrbit() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let dead = false, api: { dispose: () => void; setScroll: (v: number) => void } | null = null;
    const el = ref.current;
    if (!el) return;
    const onScroll = () => api?.setScroll(scrollY / innerHeight);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('@/lib/orbitScene').then(({ mountOrbit }) => {
        if (dead || !ref.current) return;
        try { api = mountOrbit(ref.current, prefersReducedMotion()); addEventListener('scroll', onScroll, { passive: true }); } catch { /* no WebGL */ }
      });
    }, { rootMargin: '300px 0px' });
    io.observe(el);
    return () => { dead = true; io.disconnect(); removeEventListener('scroll', onScroll); api?.dispose(); };
  }, []);
  return <canvas ref={ref} className={s.miniOrbit} aria-hidden="true" />;
}

export function FooterV7() {
  return (
    <footer className={s.footer} data-ink data-orbit="0 40 0.5 0 0">
      <div className={s.fGrid}>
        <div className={s.fCol}>
          <span className={`mono ${s.fHead}`}>Контакт:</span>
          <a href={`mailto:${C.email}`} className={s.fMail}>{C.email}</a>
          <a href={C.telegramUrl} className={s.fLink} target="_blank" rel="noreferrer">Telegram {C.telegram}</a>
          <a href={`tel:${C.phone.replace(/[^+\d]/g, '')}`} className={s.fLink}>{C.phone}</a>
        </div>
        <div className={s.fCol}>
          <span className={`mono ${s.fHead}`}>Меню:</span>
          {NAV.map(([l, h]) => <Link key={l} href={h} className={s.fNav}>{l}</Link>)}
        </div>
        <div className={s.fCol}>
          <span className={`mono ${s.fHead}`}>Студия:</span>
          <span className={s.fLink}>{C.city}</span>
          <span className={s.fLink}>{C.socials.join(' · ')}</span>
        </div>
      </div>
      <div className={s.fMark}>
        <span>ПОРУКА</span>
        <span className={s.fO} aria-hidden="true"><MiniOrbit /></span>
      </div>
      <div className={s.fLegal}>
        <span className="mono">© {C.year} Порука. Ручаемся за результат.</span>
        <a href="#top" className="mono" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }}>Наверх ↑</a>
      </div>
    </footer>
  );
}
