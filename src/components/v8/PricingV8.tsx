import { PRICING } from '@/data/content';
import v from '../v7/V7.module.css';
import s from './V8.module.css';

/** Formats and prices: three glass cards, the middle one in ultramarine; every card leads to the contact CTA. */
export function PricingV8({ eyebrow = '(04) Цены' }: { eyebrow?: string }) {
  return (
    <section id="prices" className={s.pricing} data-orbit="-30 10 0.7 18 0.5" data-orbit-m="0 30 0.6 16 0.4">
      <div className={v.secHead}>
        <span className={`mono ${v.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={v.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Форматы и цены</h2>
        <p className={v.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Ориентиры, чтобы было от чего оттолкнуться. Точную цену и сроки назовём после брифа — и они не изменятся, если не изменится объём.</p>
      </div>
      <div className={s.plans}>
        {PRICING.map((p, i) => (
          <article key={p.title} className={`${p.accent ? s.planAccent : v.glass} ${s.plan}`} data-rv style={{ ['--d' as string]: `${i * 90}ms` }}>
            <span className={`mono ${s.planNum}`}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={s.planTitle}>{p.title}</h3>
            <p className={s.planPrice}>{p.price}</p>
            <span className={`mono ${s.planTerm}`}>{p.term}</span>
            <ul className={s.planList}>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <a href="#contact" className={s.planCta}>{p.cta}<span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}
