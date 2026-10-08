'use client';
import { useState } from 'react';
import { PRICING } from '@/data/content';
import v from '../v7/V7.module.css';
import s from './Pricing.module.css';

/**
 * Prices, variant B «Строки»: editorial list. Three full-width rows — number, giant format name, term, price —
 * open into what's included and who it's for. The first row starts open.
 */
export function PricingRows({ eyebrow = '(04) Цены' }: { eyebrow?: string }) {
  const [open, setOpen] = useState(0);
  return (
    <section className={s.rows} data-orbit="34 0 0.6 18 0.4" data-orbit-m="0 30 0.5 16 0.3">
      <div className={s.rowsHead}>
        <span className={`mono ${v.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={v.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Форматы и цены</h2>
        <p className={v.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Ориентиры. Точную цену назовём после брифа — и она не изменится, если не изменится объём.</p>
      </div>
      <ul className={s.rowList}>
        {PRICING.map((p, i) => {
          const on = open === i;
          return (
            <li key={p.title} className={`${s.row} ${on ? s.rowOn : ''}`} data-rv style={{ ['--d' as string]: `${i * 90}ms` }}>
              <button type="button" className={s.rowBtn} aria-expanded={on} aria-controls={`plan-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className={`mono ${s.rowNum}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.rowName}>{p.title}</span>
                <span className={`mono ${s.rowTerm}`}>{p.term}</span>
                <span className={s.rowPrice}>{p.price}</span>
                <span className={s.rowIcon} aria-hidden="true" />
              </button>
              <div id={`plan-${i}`} className={s.rowBody} role="region" aria-label={p.title}>
                <div className={s.rowInner}>
                  <p className={s.rowFor}>{p.for}</p>
                  <ul className={s.rowItems}>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
                  <a href="#contact" className={v.ctaMain}>{p.cta}<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
