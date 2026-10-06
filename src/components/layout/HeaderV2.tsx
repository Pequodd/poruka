'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONTACTS, NAV } from '@/data/content';
import { Button } from '../ui/Button';
import s from './HeaderV2.module.css';

const LEFT: [string, string][] = [['Работы', '/portfolio/'], ['Услуги', '/#services']];
const RIGHT: [string, string][] = [['Процесс', '/#process'], ['Контакт', '/#contact']];

function NavLink({ label, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={`${s.link} ${active ? s.active : ''}`}>
      <span className="visually-hidden">{label}</span>
      <span className={s.roll} aria-hidden="true"><span>{label}</span><span>{label}</span></span>
    </Link>
  );
}

/**
 * Header (after 1367studio): transparent full-width row at the top of the page,
 * condenses into a centred ink bar on scroll; inverts to paper over [data-ink] sections.
 * The burger expands the bar downward into the menu.
 */
export function HeaderV2() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [onInk, setOnInk] = useState(false);
  const path = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setCompact(window.scrollY > 40);
      // Is the bar currently over an ink section?
      const y = (barRef.current?.getBoundingClientRect().top ?? 12) + 28;
      const hit = document.elementsFromPoint(window.innerWidth / 2, y).some((el) => el.closest('[data-ink]') && !el.closest('header'));
      setOnInk(hit);
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); cancelAnimationFrame(raf); };
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const out = (e: MouseEvent) => { if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('keydown', k);
    window.addEventListener('mousedown', out);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('mousedown', out); };
  }, [open]);

  const isActive = (href: string) => href.startsWith('/portfolio') ? path.startsWith('/portfolio') || path.startsWith('/cases') : false;
  const cls = [s.header, compact && s.compact, open && s.open, onInk && s.onInk].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div ref={barRef} className={s.bar}>
        <div className={s.row}>
          <nav className={`${s.side} ${s.left}`} aria-label="Разделы">
            {LEFT.map(([l, h]) => <NavLink key={l} label={l} href={h} active={isActive(h)} />)}
          </nav>
          <div className={s.logoWrap}>
            <Link href="/" className={s.logo} onClick={() => setOpen(false)}>Порука<span className={s.dot} aria-hidden="true" /></Link>
          </div>
          <div className={`${s.side} ${s.right}`}>
            {RIGHT.map(([l, h]) => <NavLink key={l} label={l} href={h} />)}
            {/* Shown only in the v7 glass look (see the html[data-look] rules). */}
            <Link href="#contact" className={s.cta}><span className={s.ctaDot} aria-hidden="true" />Обсудить проект</Link>
            <button type="button" className={s.burger} aria-label={open ? 'Закрыть меню' : 'Меню'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
              <span className={s.line} /><span className={s.line} />
            </button>
          </div>
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
              <div className={s.contacts}>
                <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                <a href={CONTACTS.telegramUrl} target="_blank" rel="noreferrer">Telegram ↗</a>
              </div>
              <Button variant={onInk ? 'primary' : 'inverse'} href="/#contact" onClick={() => setOpen(false)}>Обсудить проект</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
