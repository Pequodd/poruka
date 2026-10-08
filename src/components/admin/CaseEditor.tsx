'use client';
import { SCREEN_TYPES, type CaseStudy, type Project, type Screen } from '@/data/projects';
import { slugify } from './images';
import { Area, Field, ImageField, ItemTools, ListField, move, Select } from './fields';
import s from './Admin.module.css';

const SCREEN_LABELS: Record<Screen['type'], string> = {
  scroll: 'Страница в браузере (прокрутка)',
  pair: 'Десктоп + телефон',
  strip: 'Лента телефонов',
  detail: 'Деталь крупно + пояснение',
  beforeAfter: 'До / после',
};

export const emptyProject = (): Project => ({
  slug: '', title: '', meta: '', cat: 'Сайты', result: '', services: '', year: String(new Date().getFullYear()),
  case: { oneLiner: '', client: '', duration: '', stack: [], tags: [], url: '', task: ['', ''], screens: [], colors: [], font: '', decision: '', stats: [], quote: ['', ''], author: '' },
});

/** Slug suggested from the title while a new case still follows it. */
const autoSlug = (t: string) => (t.trim() ? slugify(t) : '');

export type Errors = Partial<Record<'slug' | 'title', string>>;

function Section({ n, title, children, note }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={s.section}>
      <header className={s.sectionHead}>
        <span className={`mono ${s.eyebrow}`}>({n})</span>
        <h2 className={s.sectionTitle}>{title}</h2>
        {note && <p className={s.sectionNote}>{note}</p>}
      </header>
      <div className={s.sectionBody}>{children}</div>
    </section>
  );
}

function ScreenEditor({ sc, set }: { sc: Screen; set: (v: Screen) => void }) {
  const up = (patch: Partial<Screen>) => set({ ...sc, ...patch });
  const phones = Math.max((sc.labels || []).length, Array.isArray(sc.mobile) ? sc.mobile.length : 0);
  const shots = Array.isArray(sc.mobile) ? sc.mobile : [];
  const labels = sc.labels || [];
  const setPhone = (j: number, img: string | undefined, label: string) => {
    const m = Array.from({ length: Math.max(phones, j + 1) }, (_, k) => shots[k] || '');
    const l = Array.from({ length: Math.max(phones, j + 1) }, (_, k) => labels[k] || '');
    m[j] = img || ''; l[j] = label;
    up({ mobile: m, labels: l });
  };
  const removePhone = (j: number) => up({ mobile: shots.filter((_, k) => k !== j), labels: labels.filter((_, k) => k !== j) });
  const single = typeof sc.mobile === 'string' ? sc.mobile : undefined;

  return (
    <>
      <div className={s.row2}>
        <Field label="Название экрана" value={sc.label} onChange={(v) => up({ label: v })} placeholder="Главная" hint="В подписи станет «01 — Главная»" />
        <Field label="Короткая подпись справа" value={sc.note || ''} onChange={(v) => up({ note: v || undefined })} placeholder="Оффер и подбор в один клик" />
      </div>
      {(sc.type === 'scroll' || sc.type === 'pair') && (
        <div className={s.row2}>
          <ImageField label="Десктоп" tall={sc.type === 'scroll'} hint={sc.type === 'scroll' ? 'Скриншот всей страницы шириной 1440 — прокручивается в рамке браузера' : 'Первый экран, 1440 × 900'} value={sc.desktop} onChange={(v) => up({ desktop: v })} />
          <ImageField label="Телефон" tall hint="Экран 390 × 844" value={single} onChange={(v) => up({ mobile: v })} />
        </div>
      )}
      {sc.type === 'detail' && (
        <>
          <ImageField label="Скриншот" hint="Показывается фрагмент — выберите сдвиг ниже" value={sc.desktop} onChange={(v) => up({ desktop: v })} />
          <div className={s.row2}>
            <Field label="Сдвиг по горизонтали, %" mono value={String(sc.crop?.x ?? 0)} onChange={(v) => up({ crop: { x: Math.max(0, Math.min(100, Number(v) || 0)), y: sc.crop?.y ?? 0 } })} />
            <Field label="Сдвиг по вертикали, %" mono value={String(sc.crop?.y ?? 0)} onChange={(v) => up({ crop: { x: sc.crop?.x ?? 0, y: Math.max(0, Math.min(100, Number(v) || 0)) } })} />
          </div>
          <Area label="Почему так" value={sc.why || ''} onChange={(v) => up({ why: v || undefined })} hint="2–3 предложения о решении" />
        </>
      )}
      {sc.type === 'beforeAfter' && (
        <div className={s.row2}>
          <ImageField label="До" value={sc.before} onChange={(v) => up({ before: v })} />
          <ImageField label="После" value={sc.after} onChange={(v) => up({ after: v })} />
        </div>
      )}
      {sc.type === 'strip' && (
        <div className={s.phones}>
          {Array.from({ length: phones }, (_, j) => (
            <div key={j} className={s.phone}>
              <ImageField label={`Телефон ${j + 1}`} tall value={shots[j] || undefined} onChange={(v) => setPhone(j, v, labels[j] || '')} />
              <Field label="Подпись" value={labels[j] || ''} onChange={(v) => setPhone(j, shots[j], v)} placeholder="Каталог" />
              <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={() => removePhone(j)}>Убрать телефон</button>
            </div>
          ))}
          <button type="button" className={s.addTile} onClick={() => setPhone(phones, undefined, '')}>+ Телефон</button>
        </div>
      )}
    </>
  );
}

export function CaseEditor({ p, onChange, errors, isNew, categories }: { p: Project; onChange: (p: Project) => void; errors: Errors; isNew: boolean; categories: string[] }) {
  const c = p.case;
  const up = (patch: Partial<Project>) => onChange({ ...p, ...patch });
  const upCase = (patch: Partial<CaseStudy>) => onChange({ ...p, case: { ...c, ...patch } });
  const setScreen = (i: number, sc: Screen) => upCase({ screens: c.screens.map((x, k) => (k === i ? sc : x)) });

  return (
    <div className={s.editor}>
      <Section n="01" title="Карточка в портфолио" note="Так кейс выглядит в списке работ и на главной.">
        <div className={s.row2}>
          <Field label="Название" required value={p.title} error={errors.title} onChange={(v) => onChange({ ...p, title: v, ...(isNew && p.slug === autoSlug(p.title) ? { slug: autoSlug(v) } : {}) })} placeholder="СМП Запчасть" />
          <Field label="Адрес страницы" required mono value={p.slug} error={errors.slug} onChange={(v) => up({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '') })} hint={`/cases/${p.slug || '…'}/ — латиница, цифры и дефис`} />
        </div>
        <div className={s.row3}>
          <Select label="Категория (фильтр)" value={p.cat} options={categories.includes(p.cat) || !p.cat ? categories : [...categories, p.cat]} onChange={(v) => up({ cat: v })} />
          <Field label="Год" mono value={p.year} onChange={(v) => up({ year: v.replace(/\D/g, '').slice(0, 4) })} />
          <Field label="Главная цифра" value={p.result} onChange={(v) => up({ result: v })} placeholder="+38% заявок" />
        </div>
        <div className={s.row2}>
          <Field label="Строка над названием" value={p.meta} onChange={(v) => up({ meta: v })} placeholder="2026 · Сайт · Битрикс" />
          <Field label="Услуги" value={p.services} onChange={(v) => up({ services: v })} placeholder="Дизайн, разработка" />
        </div>
        <ImageField label="Обложка" hint="16:9, от 1920 px по ширине. Без обложки карточка будет цветной плашкой." value={p.image} onChange={(v) => up({ image: v })} />
      </Section>

      <Section n="02" title="Шапка кейса">
        <Field label="Одна фраза о проекте" value={c.oneLiner} onChange={(v) => upCase({ oneLiner: v })} placeholder="Каталог запчастей для спецтехники с подбором по модели" />
        <div className={s.row3}>
          <Field label="Клиент" value={c.client} onChange={(v) => upCase({ client: v })} />
          <Field label="Срок" value={c.duration} onChange={(v) => upCase({ duration: v })} placeholder="10 недель" />
          <Field label="Сайт" mono value={c.url} onChange={(v) => upCase({ url: v.replace(/^https?:\/\//, '') })} placeholder="example.ru" hint="Без https://. Пусто — кнопки «Открыть сайт» не будет." />
        </div>
        <div className={s.row2}>
          <ListField label="Услуги (чипсы)" value={c.tags} onChange={(v) => upCase({ tags: v })} />
          <ListField label="Стек" value={c.stack} onChange={(v) => upCase({ stack: v })} />
        </div>
      </Section>

      <Section n="03" title="Задача" note="Первая часть выделяется цветом, вторая идёт следом обычным текстом.">
        <Area label="Проблема" rows={2} value={c.task[0]} onChange={(v) => upCase({ task: [v, c.task[1]] })} placeholder="Клиенты звонили, чтобы узнать, подойдёт ли деталь." />
        <Area label="Что сделали" rows={2} value={c.task[1].trimStart()} onChange={(v) => upCase({ task: [c.task[0], v ? ` ${v}` : ''] })} placeholder="Мы сделали подбор по технике и каталог, где ответ виден до звонка." />
      </Section>

      <Section n="04" title="Экраны" note="Идут по порядку. Без картинки экран показывается серой заглушкой.">
        {c.screens.map((sc, i) => (
          <div key={i} className={s.card}>
            <div className={s.cardHead}>
              <span className={`mono ${s.eyebrow}`}>{String(i + 1).padStart(2, '0')}</span>
              <Select label="Тип" value={sc.type} options={SCREEN_TYPES.map((t) => [t, SCREEN_LABELS[t]] as [Screen['type'], string])} onChange={(t) => setScreen(i, { type: t, label: sc.label, note: sc.note })} />
              <ItemTools i={i} n={c.screens.length} what={`Экран ${i + 1}`} onMove={(to) => upCase({ screens: move(c.screens, i, to) })} onRemove={() => confirm(`Удалить экран «${sc.label || i + 1}»?`) && upCase({ screens: c.screens.filter((_, k) => k !== i) })} />
            </div>
            <ScreenEditor sc={sc} set={(v) => setScreen(i, v)} />
          </div>
        ))}
        <div className={s.addRow}>
          {SCREEN_TYPES.map((t) => (
            <button key={t} type="button" className={s.btnSm} onClick={() => upCase({ screens: [...c.screens, { type: t, label: '', ...(t === 'strip' ? { mobile: ['', '', '', ''], labels: ['', '', '', ''] } : {}), ...(t === 'detail' ? { crop: { x: 0, y: 0 } } : {}) }] })}>+ {SCREEN_LABELS[t]}</button>
          ))}
        </div>
      </Section>

      <Section n="05" title="Решения">
        <div className={s.field}>
          <span className={s.label}>Цвета клиента</span>
          <div className={s.swatches}>
            {c.colors.map((col, i) => (
              <div key={i} className={s.swatch}>
                <input type="color" className={s.colorInput} value={/^#[0-9a-f]{6}$/i.test(col) ? col : '#000000'} onChange={(e) => upCase({ colors: c.colors.map((x, k) => (k === i ? e.target.value.toUpperCase() : x)) })} aria-label={`Цвет ${i + 1}`} />
                <input className={`${s.input} ${s.monoInput} ${s.hex}`} value={col} onChange={(e) => upCase({ colors: c.colors.map((x, k) => (k === i ? e.target.value : x)) })} aria-label={`HEX цвета ${i + 1}`} />
                <button type="button" className={`${s.iconBtn} ${s.iconDanger}`} onClick={() => upCase({ colors: c.colors.filter((_, k) => k !== i) })} aria-label={`Удалить цвет ${i + 1}`}>×</button>
              </div>
            ))}
            {c.colors.length < 6 && <button type="button" className={s.btnSm} onClick={() => upCase({ colors: [...c.colors, '#2F3BFF'] })}>+ Цвет</button>}
          </div>
        </div>
        <Field label="Шрифт клиента" value={c.font} onChange={(v) => upCase({ font: v })} placeholder="Manrope" hint="Название как в Google Fonts — образец подгрузится сам" />
        <Area label="Ключевое решение" value={c.decision} onChange={(v) => upCase({ decision: v })} />
      </Section>

      <Section n="06" title="Результат" note="Блок на синем фоне. Если нет ни цифр, ни отзыва — блок скрывается.">
        {c.stats.map((st, i) => (
          <div key={i} className={s.statRow}>
            <Field label="Число" mono value={st.value} onChange={(v) => upCase({ stats: c.stats.map((x, k) => (k === i ? { ...x, value: v } : x)) })} placeholder="+38" />
            <Field label="Единица" mono value={st.suffix || ''} onChange={(v) => upCase({ stats: c.stats.map((x, k) => (k === i ? { ...x, suffix: v || undefined } : x)) })} placeholder="%" />
            <Field label="Подпись" value={st.caption} onChange={(v) => upCase({ stats: c.stats.map((x, k) => (k === i ? { ...x, caption: v } : x)) })} placeholder="Заявок с сайта" />
            <ItemTools i={i} n={c.stats.length} what={`Цифра ${i + 1}`} onMove={(to) => upCase({ stats: move(c.stats, i, to) })} onRemove={() => upCase({ stats: c.stats.filter((_, k) => k !== i) })} />
          </div>
        ))}
        {c.stats.length < 4 && <button type="button" className={s.btnSm} onClick={() => upCase({ stats: [...c.stats, { value: '', caption: '' }] })}>+ Цифра</button>}
        <Area label="Отзыв" rows={3} value={c.quote.join('')} onChange={(v) => upCase({ quote: [v, ''] })} placeholder="«Менеджеры перестали отвечать на вопрос „подойдёт ли“. Теперь звонят уже с номером детали.»" />
        <Field label="Автор отзыва" value={c.author} onChange={(v) => upCase({ author: v })} placeholder="Руководитель отдела продаж · СМП Запчасть" />
      </Section>
    </div>
  );
}
