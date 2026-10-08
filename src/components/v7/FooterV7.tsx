'use client';
import Link from 'next/link';
import { CONTACTS as C, NAV } from '@/data/content';
import { prefersReducedMotion } from '@/lib/hooks';
import s from './V7.module.css';

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
      <div className={s.fLegal}>
        <span className="mono">© {C.year} Студия «Порука»</span>
        <a href="#top" className="mono" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }}>Наверх ↑</a>
      </div>
    </footer>
  );
}
