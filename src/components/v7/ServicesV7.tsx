'use client';
import { useRef } from 'react';
import { SERVICES } from '@/data/content';
import { useProgress } from './useProgress';
import s from './V7.module.css';

const K = [-70, 30, -40, 80];

/** Services as frosted glass cards over the enlarged glass seal; columns drift at different speeds. */
export function ServicesV7() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--sv', p.toFixed(4)));
  return (
    <section ref={ref} id="services" className={s.services} data-orbit="0 6 1.45 0 1" data-orbit-m="0 0 1.2 0 1">
      <div className={s.secHead}>
        <span className={`mono ${s.eyebrow}`} data-rv>(01) Услуги</span>
        <h2 className={s.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Что мы делаем</h2>
        <p className={s.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Семь направлений — от одного лендинга до поддержки большого сайта. Берём только то, за что готовы поручиться.</p>
      </div>
      <div className={s.cards}>
        {SERVICES.map((sv, i) => (
          <div key={sv.num} className={s.cardCol} style={{ ['--k' as string]: K[i % 4] }}>
            <article className={`${s.glass} ${s.card}`} data-rv style={{ ['--d' as string]: `${(i % 4) * 90}ms` }}>
              <div className={s.cardTop}>
                <span className="mono">({sv.num})</span>
                {sv.tag && <span className={`mono ${s.tagUltra}`}>{sv.tag}</span>}
              </div>
              <h3 className={s.cardTitle}>{sv.title}</h3>
              <p className={s.cardText}>{sv.description}</p>
              <ul className={s.cardList}>{sv.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
              <div className={s.cardChips}>{sv.stack.map((t) => <span key={t} className={`mono ${s.pill}`}>{t}</span>)}</div>
            </article>
          </div>
        ))}
        <div className={s.cardCol} style={{ ['--k' as string]: K[3] }}>
          <a href="#contact" className={s.cardUltra} data-rv style={{ ['--d' as string]: '270ms' }}>
            <span className="mono">(08)</span>
            <span className={s.cardUltraTitle}>Не нашли свою задачу?</span>
            <span className={s.cardUltraText}>Расскажите — предложим решение и честно скажем, если оно не наше.</span>
            <span className={s.arrow} aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
