'use client';
import { useEffect, useRef, useState } from 'react';
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
  wide: 'Крупный экран в браузере',
  stage: 'Крупный экран на цветном фоне',
  grid: 'Сетка из трёх экранов',
  text: 'Текстовая вставка',
};

/** Short names for the structure panel. */
const SCREEN_SHORT: Record<Screen['type'], string> = {
  scroll: 'Прокрутка', pair: 'Десктоп + телефон', strip: 'Телефоны', detail: 'Деталь', beforeAfter: 'До / после',
  wide: 'Крупный экран', stage: 'Экран на фоне', grid: 'Сетка', text: 'Текст',
};

const newScreen = (t: Screen['type']): Screen => ({
  type: t, label: '',
  ...(t === 'strip' ? { mobile: ['', '', '', ''], labels: ['', '', '', ''] } : {}),
  ...(t === 'detail' ? { crop: { x: 0, y: 0 } } : {}),
  ...(t === 'grid' ? { images: ['', '', ''] } : {}),
});

const SECTIONS: [string, string][] = [['01', 'Карточка'], ['02', 'Шапка кейса'], ['03', 'Задача'], ['04', 'Экраны'], ['05', 'Решения'], ['06', 'Результат']];

/** Thin divider between screens; «+» opens the block types and inserts the chosen one exactly here. */
function Inserter({ open, onOpen, onClose, onPick, last }: { open: boolean; onOpen: () => void; onClose: () => void; onPick: (t: Screen['type']) => void; last?: boolean }) {
  if (!open)
    return (
      <div className={`${s.inserter} ${last ? s.inserterLast : ''}`}>
        <button type="button" className={s.insertBtn} onClick={onOpen}>{last ? '+ Добавить блок в конец' : '+ Вставить блок сюда'}</button>
      </div>
    );
  return (
    <div className={s.insertMenu} role="group" aria-label="Тип нового блока">
      <span className={`mono ${s.eyebrow}`}>Какой блок вставить?</span>
      <div className={s.addRow}>
        {SCREEN_TYPES.map((t) => <button key={t} type="button" className={s.btnSm} onClick={() => onPick(t)}>{SCREEN_LABELS[t]}</button>)}
        <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
}

export const emptyProject = (): Project => ({
  slug: '', title: '', meta: '', cat: 'Сайты', result: '', services: '', year: String(new Date().getFullYear()),
  case: { oneLiner: '', client: '', duration: '', stack: [], tags: [], url: '', task: ['', ''], screens: [], colors: [], font: '', decision: '', stats: [], quote: ['', ''], author: '' },
});

/** Slug suggested from the title while a new case still follows it. */
const autoSlug = (t: string) => (t.trim() ? slugify(t) : '');

export type Errors = Partial<Record<'slug' | 'title', string>>;

function Section({ n, title, children, note }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={`sec-${n}`} className={s.section} data-outline={`sec-${n}`}>
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
      {sc.type === 'text' ? (
        <>
          <Area label="Фраза" rows={2} value={sc.label} onChange={(v) => up({ label: v })} placeholder="Главный вопрос покупателя — подойдёт ли деталь" />
          <div className={s.row2}>
            <Field label="Надпись над фразой" value={sc.note || ''} onChange={(v) => up({ note: v || undefined })} placeholder="Инсайт из интервью" />
            <Area label="Абзац под фразой" value={sc.why || ''} onChange={(v) => up({ why: v || undefined })} />
          </div>
        </>
      ) : (
      <div className={s.row2}>
        <Field label="Название экрана" value={sc.label} onChange={(v) => up({ label: v })} placeholder="Главная" hint="В подписи станет «01 — Главная»" />
        <Field label="Короткая подпись справа" value={sc.note || ''} onChange={(v) => up({ note: v || undefined })} placeholder="Оффер и подбор в один клик" />
      </div>
      )}
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
      {(sc.type === 'wide' || sc.type === 'stage') && (
        <ImageField label="Скриншот" hint="Первый экран сайта, 1440 × 900 или больше — займёт всю ширину" value={sc.desktop} onChange={(v) => up({ desktop: v })} />
      )}
      {sc.type === 'stage' && (
        <div className={s.field}>
          <span className={s.label}>Цвет фона</span>
          <div className={s.swatches}>
            <input type="color" className={s.colorInput} value={/^#[0-9a-f]{6}$/i.test(sc.bg || '') ? sc.bg : '#2F3BFF'} onChange={(e) => up({ bg: e.target.value.toUpperCase() })} aria-label="Цвет фона" />
            {sc.bg ? <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={() => up({ bg: undefined })}>Взять первый цвет клиента</button> : <span className={s.hint}>Сейчас — первый из «Цветов клиента»</span>}
          </div>
        </div>
      )}
      {sc.type === 'grid' && (
        <div className={s.row3}>
          {[0, 1, 2].map((j) => (
            <ImageField key={j} label={j === 0 ? 'Большой экран' : `Малый экран ${j}`} value={sc.images?.[j] || undefined}
              onChange={(v) => up({ images: [0, 1, 2].map((k) => (k === j ? v || '' : sc.images?.[k] || '')) })} />
          ))}
        </div>
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

  // Stable React keys for screens (the data has no ids): kept in step with every insert / move / remove.
  const seq = useRef(0);
  const keys = useRef<string[]>([]);
  if (keys.current.length !== c.screens.length) keys.current = c.screens.map(() => `s${++seq.current}`);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const insert = (i: number, t: Screen['type']) => {
    const k = `s${++seq.current}`;
    keys.current = [...keys.current.slice(0, i), k, ...keys.current.slice(i)];
    upCase({ screens: [...c.screens.slice(0, i), newScreen(t), ...c.screens.slice(i)] });
    setInsertAt(null); setJustAdded(k);
  };
  const moveScreen = (from: number, to: number) => {
    if (to < 0 || to >= c.screens.length || from === to) return;
    keys.current = move(keys.current, from, to);
    upCase({ screens: move(c.screens, from, to) });
  };
  const removeScreen = (i: number) => {
    keys.current = keys.current.filter((_, k) => k !== i);
    upCase({ screens: c.screens.filter((_, k) => k !== i) });
  };
  useEffect(() => {
    if (!justAdded) return;
    document.getElementById(`scr-${justAdded}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setJustAdded(null);
  }, [justAdded]);

  // Structure panel: highlight the block the editor is scrolled to.
  const [active, setActive] = useState('sec-01');
  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      let cur = 'sec-01';
      document.querySelectorAll<HTMLElement>('[data-outline]').forEach((el) => { if (el.getBoundingClientRect().top < 160) cur = el.dataset.outline!; });
      setActive(cur);
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    addEventListener('scroll', q, { passive: true });
    return () => { removeEventListener('scroll', q); cancelAnimationFrame(raf); };
  }, [c.screens.length]);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  return (
    <div className={s.editorWrap}>
      <nav className={s.outline} aria-label="Структура кейса">
        <span className={`mono ${s.eyebrow}`}>Структура</span>
        <ol className={s.outList}>
          {SECTIONS.map(([n, t]) => (
            <li key={n}>
              <button type="button" className={`${s.outItem} ${active === `sec-${n}` ? s.outActive : ''}`} onClick={() => go(`sec-${n}`)}>
                <span className="mono">{n}</span>{t}
                {n === '01' && (errors.title || errors.slug) && <span className={s.outErr} aria-label="есть ошибки" />}
                {n === '04' && <span className={s.outCount}>{c.screens.length}</span>}
              </button>
              {n === '04' && (
                <ol className={s.outScreens}>
                  {c.screens.map((sc, i) => {
                    const id = `scr-${keys.current[i]}`;
                    return (
                      <li key={keys.current[i]} draggable
                        onDragStart={(e) => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; }}
                        onDragOver={(e) => { e.preventDefault(); setOver(i); }}
                        onDragLeave={() => setOver((o) => (o === i ? null : o))}
                        onDrop={(e) => { e.preventDefault(); if (drag !== null) moveScreen(drag, i); setDrag(null); setOver(null); }}
                        onDragEnd={() => { setDrag(null); setOver(null); }}
                        className={`${drag === i ? s.outDragging : ''} ${over === i && drag !== null && drag !== i ? (drag < i ? s.outDropAfter : s.outDropBefore) : ''}`}>
                        <button type="button" className={`${s.outScreen} ${active === id ? s.outActive : ''}`} onClick={() => go(id)} title="Перетащите, чтобы поменять порядок">
                          <span className={s.outGrip} aria-hidden="true">⋮⋮</span>
                          <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                          <span className={s.outText}><b>{SCREEN_SHORT[sc.type]}</b>{sc.label && <span>{sc.label}</span>}</span>
                        </button>
                      </li>
                    );
                  })}
                  <li><button type="button" className={s.outAdd} onClick={() => { setInsertAt(c.screens.length); setTimeout(() => go('sec-04-end'), 50); }}>+ Блок</button></li>
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>
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
          <div key={keys.current[i]}>
            <Inserter open={insertAt === i} onOpen={() => setInsertAt(i)} onClose={() => setInsertAt(null)} onPick={(t) => insert(i, t)} />
            <div id={`scr-${keys.current[i]}`} className={`${s.card} ${s.scrCard}`} data-outline={`scr-${keys.current[i]}`}>
              <div className={s.cardHead}>
                <span className={`mono ${s.eyebrow}`}>{String(i + 1).padStart(2, '0')}</span>
                <Select label="Тип" value={sc.type} options={SCREEN_TYPES.map((t) => [t, SCREEN_LABELS[t]] as [Screen['type'], string])} onChange={(t) => setScreen(i, { type: t, label: sc.label, note: sc.note })} />
                <ItemTools i={i} n={c.screens.length} what={`Экран ${i + 1}`} onMove={(to) => moveScreen(i, to)} onRemove={() => confirm(`Удалить блок «${sc.label || i + 1}»?`) && removeScreen(i)} />
              </div>
              <ScreenEditor sc={sc} set={(v) => setScreen(i, v)} />
            </div>
          </div>
        ))}
        <div id="sec-04-end"><Inserter last open={insertAt === c.screens.length} onOpen={() => setInsertAt(c.screens.length)} onClose={() => setInsertAt(null)} onPick={(t) => insert(c.screens.length, t)} /></div>
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
    </div>
  );
}
