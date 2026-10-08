'use client';
import { createContext, useContext, useId, useRef, useState } from 'react';
import s from './Admin.module.css';

/** What image fields need from the admin shell: show a path (pending upload or published) and upload a file. */
export const ImagesCtx = createContext<{ src: (path: string) => string; upload: (file: File) => Promise<string> }>({ src: (p) => p, upload: async () => '' });

export function Field({ label, hint, value, onChange, placeholder, required, error, mono }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; error?: string; mono?: boolean;
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>{label}{required && <span className={s.req} aria-hidden="true"> *</span>}</label>
      <input id={id} className={`${s.input} ${mono ? s.monoInput : ''} ${error ? s.invalid : ''}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={hint || error ? `${id}-h` : undefined} />
      {(error || hint) && <span id={`${id}-h`} className={error ? s.error : s.hint}>{error || hint}</span>}
    </div>
  );
}

export function Area({ label, hint, value, onChange, rows = 3, placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>{label}</label>
      <textarea id={id} className={s.input} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-h` : undefined} />
      {hint && <span id={`${id}-h`} className={s.hint}>{hint}</span>}
    </div>
  );
}

export function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly (T | [T, string])[]; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>{label}</label>
      <select id={id} className={s.input} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}
      </select>
    </div>
  );
}

/**
 * Comma-separated list ↔ string[]; keeps the raw text while typing so «1С, » doesn't lose the trailing comma.
 * The editor is remounted per case, so the initial value is enough.
 */
export function ListField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const [raw, setRaw] = useState(value.join(', '));
  return <Field label={label} hint={hint ?? 'Через запятую'} value={raw} onChange={(v) => { setRaw(v); onChange(v.split(',').map((x) => x.trim()).filter(Boolean)); }} />;
}

export function ImageField({ label, hint, value, onChange, tall }: { label: string; hint?: string; value?: string; onChange: (v: string | undefined) => void; tall?: boolean }) {
  const { src, upload } = useContext(ImagesCtx);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErr('Это не изображение'); return; }
    setBusy(true); setErr('');
    try { onChange(await upload(f)); } catch (e) { setErr(e instanceof Error ? e.message : 'Не удалось обработать файл'); }
    setBusy(false);
  };
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      <div
        className={`${s.drop} ${tall ? s.dropTall : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}
      >
        {value ? <img src={src(value)} alt="" className={s.dropImg} /> : <span className={s.dropEmpty}>{busy ? 'Сжимаем…' : 'Перетащите файл или выберите'}</span>}
        <div className={s.dropBar}>
          <button type="button" className={s.btnSm} onClick={() => input.current?.click()} disabled={busy}>{value ? 'Заменить' : 'Выбрать файл'}</button>
          {value && <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={() => onChange(undefined)}>Убрать</button>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      {(err || hint) && <span className={err ? s.error : s.hint}>{err || hint}</span>}
    </div>
  );
}

/** Row of small icon buttons to move / delete an item in a list. */
export function ItemTools({ i, n, onMove, onRemove, what }: { i: number; n: number; onMove: (to: number) => void; onRemove: () => void; what: string }) {
  return (
    <div className={s.itemTools}>
      <button type="button" className={s.iconBtn} onClick={() => onMove(i - 1)} disabled={i === 0} aria-label={`${what}: выше`}>↑</button>
      <button type="button" className={s.iconBtn} onClick={() => onMove(i + 1)} disabled={i === n - 1} aria-label={`${what}: ниже`}>↓</button>
      <button type="button" className={`${s.iconBtn} ${s.iconDanger}`} onClick={onRemove} aria-label={`${what}: удалить`}>×</button>
    </div>
  );
}

export const move = <T,>(arr: T[], from: number, to: number) => {
  if (to < 0 || to >= arr.length) return arr;
  const a = arr.slice(); const [x] = a.splice(from, 1); a.splice(to, 0, x); return a;
};
