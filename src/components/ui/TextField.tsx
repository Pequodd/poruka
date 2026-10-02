'use client';
import { useId } from 'react';
import s from './TextField.module.css';

type Props = {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; multiline?: boolean; name?: string; type?: string; disabled?: boolean; required?: boolean; autoComplete?: string;
};

/** Bottom hairline only; focus = 2px ink, error = seal line + message. */
export function TextField({ label, value, onChange, error, multiline, name, type = 'text', disabled, required, autoComplete }: Props) {
  const id = useId();
  const common = {
    id, name, value, disabled, required, autoComplete,
    className: s.input,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div className={[s.field, error && s.error, disabled && s.disabled].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={s.label}>{label}</label>
      {multiline ? <textarea rows={3} {...common} /> : <input type={type} {...common} />}
      {error && <span id={`${id}-err`} role="alert" className={s.msg}>{error}</span>}
    </div>
  );
}
