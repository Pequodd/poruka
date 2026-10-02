'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CONTACTS, NAV } from '@/data/content';
import { Button } from '../ui/Button';
import s from './HeaderV2.module.css';

/** Fixed header: mono email · ink bar with wordmark + burger (expands into the menu) · «Обсудить проект». */
export function HeaderV2() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  return (
    <header className={`${s.header} ${open ? s.open : ''}`}>
      <div className={`container ${s.grid}`}>
        <a href={`mailto:${CONTACTS.email}`} className={s.mail}>{CONTACTS.email}</a>
        <div className={s.bar}>
          <div className={s.top}>
            <Link href="/" className={s.logo} onClick={() => setOpen(false)}>Порука<span className={s.dot} aria-hidden="true" /></Link>
            <button type="button" className={s.burger} aria-label={open ? 'Закрыть меню' : 'Меню'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
              <span className={s.line} /><span className={s.line} />
            </button>
          </div>
          <div className={s.drawer} id="site-menu" inert={!open}>
            <div className={s.drawerInner}>
              <nav className={s.nav} aria-label="Основное меню">
                {NAV.map(([label, href], i) => (
                  <Link key={label} href={href} className={s.item} style={{ transitionDelay: open ? `${80 + i * 40}ms` : '0ms' }} onClick={() => setOpen(false)}>
                    <span className={s.num}>0{i + 1}</span>{label}
                  </Link>
                ))}
              </nav>
              <div className={s.foot}>
                <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                <a href={CONTACTS.telegramUrl} target="_blank" rel="noreferrer">Telegram ↗</a>
              </div>
            </div>
          </div>
        </div>
        <div className={s.cta}><Button variant="secondary" href="/#contact">Обсудить проект</Button></div>
      </div>
    </header>
  );
}
