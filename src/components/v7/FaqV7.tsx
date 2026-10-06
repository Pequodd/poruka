'use client';
import { useRef } from 'react';
import { useProgress } from './useProgress';
import s from './V7.module.css';

/** Placeholder answers written from the site's own facts (services, case timings) — confirm with the studio. */
const FAQ: [string, string][] = [
  ['Сколько стоит сайт?', 'Называем фиксированную цену после брифа — она зависит от объёма, а не от того, сколько часов мы потратим. Если объём не меняется, цена тоже не меняется.'],
  ['Сколько длится проект?', 'Сайт для запуска продукта — от трёх недель, корпоративный сайт или каталог — 6–12 недель. Сроки по каждому этапу видны в плане работ с первого дня.'],
  ['На чём вы делаете сайты?', 'WordPress и Elementor, 1С‑Битрикс или Next.js. Выбираем под задачу и под то, кто будет редактировать сайт после запуска.'],
  ['Что будет после запуска?', 'Поддержка по SLA: правки, обновления, новые разделы и ежемесячный отчёт. Можно и без поддержки — передадим доступы и обучим команду.'],
  ['Как вы используете AI?', 'Для концепций и черновиков контента — это экономит до трети бюджета. Решения, детали и финальное качество остаются за людьми.'],
];

/** FAQ: the glass links park on the left in focus; a giant background word slides with scroll; answers expand in place. */
export function FaqV7() {
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--fq', p.toFixed(4)));
  return (
    <section ref={ref} id="faq" className={s.faq} data-orbit="-27 0 0.82 0 1" data-orbit-m="0 -30 0.55 0 0.9">
      <div className={s.faqBg} aria-hidden="true">вопросы · вопросы · вопросы · вопросы</div>
      <div className={s.faqGrid}>
        <div className={s.faqSide}>
          <span className={`mono ${s.eyebrow}`} data-rv>(08) Вопросы</span>
        </div>
        <div className={s.faqMain}>
          <h2 className={s.h2} data-rv>Частые вопросы</h2>
          <div className={s.faqList}>
            {FAQ.map(([q, a], i) => (
              <details key={q} className={s.faqItem} data-rv style={{ ['--d' as string]: `${i * 80}ms` }}>
                <summary><span>{q}</span><span className="mono">({i + 1})</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
