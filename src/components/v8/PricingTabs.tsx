'use client';
import { useRef, useState } from 'react';
import { PRICING } from '@/data/content';
import v from '../v7/V7.module.css';
import s from './Pricing.module.css';

/**
 * Prices, variant C «Переключатель»: a liquid-glass segmented control (same material as the header) switches one large
 * panel — price and term on the left, contents and CTA on the right. Arrow keys move between formats.
 */
export function PricingTabs({ eyebrow = '(04) Цены' }: { eyebrow?: string }) {
  const [cur, setCur] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PRICING[cur];
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = (cur + d + PRICING.length) % PRICING.length;
    setCur(n); tabs.current[n]?.focus();
  };
  return (
    <section className={s.tabs} data-orbit="-34 6 0.7 16 0.5" data-orbit-m="0 34 0.5 16 0.3">
      <div className={v.secHead}>
        <span className={`mono ${v.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={v.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Форматы и цены</h2>
      </div>
      <div className={s.seg} role="tablist" aria-label="Формат" data-rv style={{ ['--d' as string]: '160ms', ['--i' as string]: cur, ['--n' as string]: PRICING.length }} onKeyDown={key}>
        <span className={s.segThumb} aria-hidden="true" />
        {PRICING.map((x, i) => (
          <button key={x.title} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`tab-${i}`} aria-selected={i === cur} aria-controls="plan-panel" tabIndex={i === cur ? 0 : -1}
            className={`${s.segBtn} ${i === cur ? s.segOn : ''}`} onClick={() => setCur(i)}>{x.title}</button>
        ))}
      </div>
      <div id="plan-panel" role="tabpanel" aria-labelledby={`tab-${cur}`} className={`${v.glass} ${s.panel}`} data-rv style={{ ['--d' as string]: '240ms' }}>
        <div key={cur} className={s.panelLeft}>
          <span className={`mono ${v.eyebrow}`}>{String(cur + 1).padStart(2, '0')} / {String(PRICING.length).padStart(2, '0')}</span>
          <p className={s.panelPrice}>{p.price}</p>
          <span className={`mono ${s.panelTerm}`}>{p.term}</span>
          <p className={s.panelFor}>{p.for}</p>
        </div>
        <div key={`r${cur}`} className={s.panelRight}>
          <span className={`mono ${v.eyebrow}`}>Что входит</span>
          <ul className={s.panelItems}>{p.items.map((x, i) => <li key={x} style={{ ['--k' as string]: i }}><span className={s.check} aria-hidden="true">✓</span>{x}</li>)}</ul>
          <a href="#contact" className={v.ctaMain}>{p.cta}<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
        </div>
      </div>
      <p className={`${v.secLead} ${s.tabsNote}`}>Точную цену назовём после брифа — и она не изменится, если не изменится объём.</p>
    </section>
  );
}
