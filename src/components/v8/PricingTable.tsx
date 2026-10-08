import { PRICING, PRICING_COMPARE } from '@/data/content';
import v from '../v7/V7.module.css';
import s from './Pricing.module.css';

const cell = (x: boolean | string) => (x === true ? <span className={s.yes} aria-label="входит">✓</span> : x === false ? <span className={s.no} aria-label="не входит">—</span> : x);

/**
 * Prices, variant D «Сравнение»: one glass table — formats in columns (the middle one in ultramarine),
 * price and term on top, what's included in rows, a CTA at the foot of each column. Scrolls sideways on phones.
 */
export function PricingTable({ eyebrow = '(04) Цены' }: { eyebrow?: string }) {
  return (
    <section className={s.table} data-orbit="34 -10 0.6 18 0.4" data-orbit-m="0 30 0.5 16 0.3">
      <div className={v.secHead}>
        <span className={`mono ${v.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={v.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Сравните форматы</h2>
        <p className={v.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Цены — ориентиры. Точную назовём после брифа, и она не изменится, если не изменится объём.</p>
      </div>
      <div className={`${v.glass} ${s.tableWrap}`} data-rv style={{ ['--d' as string]: '220ms' }}>
        <table className={s.grid}>
          <caption className="visually-hidden">Сравнение форматов: цена, срок и что входит</caption>
          <thead>
            <tr>
              <td />
              {PRICING.map((p) => (
                <th key={p.title} scope="col" className={p.accent ? s.colAccent : ''}>
                  <span className={s.thName}>{p.title}</span>
                  <span className={s.thPrice}>{p.price}</span>
                  <span className={`mono ${s.thTerm}`}>{p.term}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICING_COMPARE.map(([name, vals]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                {vals.map((x, i) => <td key={i} className={PRICING[i].accent ? s.colAccent : ''}>{cell(x)}</td>)}
              </tr>
            ))}
            <tr className={s.ctaRow}>
              <td />
              {PRICING.map((p) => <td key={p.title} className={p.accent ? s.colAccent : ''}><a href="#contact" className={s.tableCta}>{p.cta}<span aria-hidden="true">→</span></a></td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <p className={`mono ${s.swipeHint}`} aria-hidden="true">Листайте таблицу →</p>
    </section>
  );
}
