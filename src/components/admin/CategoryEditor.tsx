'use client';
import { useState } from 'react';
import { ItemTools, move } from './fields';
import s from './Admin.module.css';

/**
 * Portfolio filter categories: order (= order of the filter chips), rename (cases follow), add, delete.
 * A category in use can only be deleted after its cases are moved to another one.
 */
export function CategoryEditor({ categories, usage, onChange }: {
  categories: string[];
  usage: Record<string, number>;
  onChange: (next: string[], renamed?: { from: string; to: string }, removed?: { name: string; to: string }) => void;
}) {
  const [editing, setEditing] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [removing, setRemoving] = useState<{ i: number; to: string } | null>(null);
  const [added, setAdded] = useState('');
  const [addErr, setAddErr] = useState('');

  const clash = (name: string, except = -1) => categories.some((c, k) => k !== except && c.toLowerCase() === name.toLowerCase());

  const commit = (i: number) => {
    const raw = editing[i];
    if (raw === undefined) return;
    const name = raw.trim().replace(/\s+/g, ' ');
    const old = categories[i];
    const err = !name ? 'Название не может быть пустым' : clash(name, i) ? 'Такая категория уже есть' : '';
    if (err) { setErrors((e) => ({ ...e, [i]: err })); return; }
    setErrors(({ [i]: _, ...e }) => e);
    setEditing(({ [i]: _, ...e }) => e);
    if (name !== old) onChange(categories.map((c, k) => (k === i ? name : c)), { from: old, to: name });
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const name = added.trim().replace(/\s+/g, ' ');
    if (!name) return;
    if (clash(name)) { setAddErr('Такая категория уже есть'); return; }
    onChange([...categories, name]);
    setAdded(''); setAddErr('');
  };

  const remove = (i: number, to?: string) => {
    const name = categories[i];
    onChange(categories.filter((_, k) => k !== i), undefined, to ? { name, to } : undefined);
    setRemoving(null); setEditing({}); setErrors({});
  };

  return (
    <div className={s.editor}>
      <section className={s.section}>
        <header className={s.sectionHead}>
          <span className={`mono ${s.eyebrow}`}>(01)</span>
          <h2 className={s.sectionTitle}>Категории портфолио</h2>
          <p className={s.sectionNote}>Это фильтры на странице «Работы» — в том же порядке. Пустые категории на сайте не показываются. При переименовании кейсы переходят за категорией сами.</p>
        </header>
        <ul className={s.cats}>
          {categories.map((c, i) => {
            const n = usage[c] || 0;
            return (
              <li key={`${i}-${c}`} className={s.catRow}>
                <span className={`mono ${s.eyebrow}`}>{String(i + 1).padStart(2, '0')}</span>
                <div className={s.field}>
                  <input
                    className={`${s.input} ${errors[i] ? s.invalid : ''}`}
                    value={editing[i] ?? c}
                    aria-label={`Название категории ${i + 1}`}
                    aria-invalid={!!errors[i]}
                    onChange={(e) => setEditing((x) => ({ ...x, [i]: e.target.value }))}
                    onBlur={() => commit(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      if (e.key === 'Escape') { setEditing(({ [i]: _, ...x }) => x); setErrors(({ [i]: _, ...x }) => x); }
                    }}
                  />
                  {errors[i] && <span className={s.error}>{errors[i]}</span>}
                </div>
                <span className={s.catCount}>{n ? `${n} ${n === 1 ? 'кейс' : n < 5 ? 'кейса' : 'кейсов'}` : 'пусто'}</span>
                <ItemTools i={i} n={categories.length} what={c} onMove={(to) => onChange(move(categories, i, to))}
                  onRemove={() => (n ? setRemoving({ i, to: categories.find((x, k) => k !== i) || '' }) : confirm(`Удалить категорию «${c}»?`) && remove(i))} />
                {removing?.i === i && (
                  <div className={s.catMove} role="group" aria-label={`Удаление категории ${c}`}>
                    <span>В категории {n} {n === 1 ? 'кейс' : n < 5 ? 'кейса' : 'кейсов'}. Перенести в</span>
                    <select className={s.input} value={removing.to} onChange={(e) => setRemoving({ i, to: e.target.value })} aria-label="Категория для кейсов">
                      {categories.filter((_, k) => k !== i).map((x) => <option key={x} value={x}>{x}</option>)}
                    </select>
                    <button type="button" className={`${s.btnSm} ${s.btnDanger}`} disabled={!removing.to} onClick={() => remove(i, removing.to)}>Перенести и удалить</button>
                    <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={() => setRemoving(null)}>Отмена</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <form className={s.catAdd} onSubmit={add}>
          <div className={s.field}>
            <label htmlFor="new-cat" className={s.label}>Новая категория</label>
            <input id="new-cat" className={`${s.input} ${addErr ? s.invalid : ''}`} value={added} onChange={(e) => { setAdded(e.target.value); setAddErr(''); }} placeholder="Например, Интернет‑магазины" />
            {addErr && <span className={s.error}>{addErr}</span>}
          </div>
          <button className={s.btnPrimary} disabled={!added.trim()}>Добавить</button>
        </form>
      </section>
    </div>
  );
}
