'use client';
import { useId } from 'react';
import s from './TextField.module.css';

type Props = {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; multiline?: boolean; name?: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  disabled?: boolean; required?: boolean; autoComplete?: string; placeholder?: string;
};

/** White field box: mono label inside, value below. Hover darkens the frame, focus = 2px ink, error = 2px seal + message. */
export function TextField({ label, value, onChange, error, multiline, name, type = 'text', inputMode, disabled, required, autoComplete, placeholder }: Props) {
  const id = useId();
  const common = {
    id, name, value, disabled, required, autoComplete, placeholder,
    className: s.input,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div className={[s.field, error && s.error, disabled && s.disabled].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={s.box}>
        <span className={s.labelRow}>
          <span className={s.label}>{label}</span>
          {required && <span className={s.req}>Обязательно</span>}
        </span>
        {multiline ? <textarea rows={4} {...common} /> : <input type={type} inputMode={inputMode} {...common} />}
      </label>
      {error && <span id={`${id}-err`} role="alert" className={s.msg}>{error}</span>}
    </div>
  );
}
