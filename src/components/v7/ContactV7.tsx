'use client';
import { useEffect, useRef } from 'react';
import { CONTACTS } from '@/data/content';
import { asset } from '@/lib/asset';
import { prefersReducedMotion } from '@/lib/hooks';
import s from './V7.module.css';

/**
 * Closing call to action: a dark rounded panel that flows into the footer, the first-screen glass video dimmed
 * behind it (the site opens and closes on the same material), one big Telegram button, mail and phone under it.
 */
export function ContactV7({ eyebrow = '(09) Контакт' }: { eyebrow?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const m = matchMedia('(max-width: 767px)').matches;
    v.poster = asset(m ? '/assets/v7/hero-poster-m.jpg' : '/assets/v7/hero-poster.jpg');
    if (prefersReducedMotion()) return;
    // Load the loop only when the panel approaches; pause it off-screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.src) v.src = asset(m ? '/assets/v7/hero-m.mp4' : '/assets/v7/hero.mp4'); v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: '300px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section id="contact" className={s.cta} data-ink data-orbit="0 10 0.9 8 0" aria-labelledby="contact-title">
      <div className={s.ctaMedia} aria-hidden="true"><video ref={video} muted loop playsInline preload="none" /></div>
      <div className={s.ctaInner}>
        <span className={`mono ${s.ctaEyebrow}`} data-rv>{eyebrow}</span>
        <h2 id="contact-title" className={s.ctaTitle} data-rv style={{ ['--d' as string]: '80ms' }}>Начнём с&nbsp;короткого разговора</h2>
        <p className={s.ctaLead} data-rv style={{ ['--d' as string]: '160ms' }}>Напишите, что есть сейчас и что нужно. Ответим в течение дня и честно скажем, если задача не наша.</p>
        <a className={s.ctaTg} href={CONTACTS.telegramUrl} target="_blank" rel="noreferrer" data-rv style={{ ['--d' as string]: '240ms' }}>
          <span>Написать в Telegram</span>
          <span className={s.ctaTgIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
              <path d="M21.5 3.5 2.8 10.7c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.8 4.7 3.5c.7.5 1.7.1 1.9-.8l3-14.9c.2-1.1-.9-2-2-1.6Z" />
              <path d="m7.5 14.1 9.6-6.4" />
            </svg>
          </span>
        </a>
        <div className={s.ctaDirect} data-rv style={{ ['--d' as string]: '320ms' }}>
          <span className={s.liveDot} aria-hidden="true" />
          <span>Или напрямую:</span>
          <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
          <a href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
        </div>
      </div>
    </section>
  );
}
