import s from './V7.module.css';

/** Placeholder answers written from the site's own facts (services, case timings) — confirm with the studio. */
const FAQ: [string, string][] = [
  ['Сколько стоит сайт?', 'Называем фиксированную цену после брифа — она зависит от объёма, а не от того, сколько часов мы потратим. Если объём не меняется, цена тоже не меняется.'],
  ['Сколько длится проект?', 'Сайт для запуска продукта — от трёх недель, корпоративный сайт или каталог — 6–12 недель. Сроки по каждому этапу видны в плане работ с первого дня.'],
  ['На чём вы делаете сайты?', 'WordPress и Elementor, 1С‑Битрикс или Next.js. Выбираем под задачу и под то, кто будет редактировать сайт после запуска.'],
  ['Что будет после запуска?', 'Поддержка по SLA: правки, обновления, новые разделы и ежемесячный отчёт. Можно и без поддержки — передадим доступы и обучим команду.'],
  ['Как вы используете AI?', 'Для концепций и черновиков контента — это экономит до трети бюджета. Решения, детали и финальное качество остаются за людьми.'],
];

/**
 * FAQ on the site's section rule: centred head (eyebrow, title, lead) and the questions in one column on the 12-col grid
 * (cols 3–10). Each row: number, question, a «+» that turns into «×» when open. The glass links rest out of focus aside.
 */
export function FaqV7({ eyebrow = '(07) Вопросы' }: { eyebrow?: string }) {
  return (
    <section id="faq" className={s.faq} data-orbit="-36 6 0.9 18 0.45" data-orbit-m="0 -34 0.5 14 0.35">
      <div className={s.secHead}>
        <span className={`mono ${s.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={s.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Частые вопросы</h2>
        <p className={s.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Коротко о цене, сроках и том, что будет после запуска.</p>
      </div>
      <div className={s.faqGrid}>
        <div className={s.faqList}>
          {FAQ.map(([q, a], i) => (
            <details key={q} className={s.faqItem} data-rv style={{ ['--d' as string]: `${i * 80}ms` }}>
              <summary>
                <span className={`mono ${s.faqNum}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.faqQ}>{q}</span>
                <span className={s.faqIcon} aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
          <a href="#contact" className={s.faqMore} data-rv>Не нашли ответ? Спросите напрямую <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
