'use client';
import { useId, useState } from 'react';
import { Chip } from './Chip';
import s from './ServiceRow.module.css';

type Props = {
  num: string; title: string; description: string; tag?: string;
  deliverables?: string[]; stack?: string[];
  expanded?: boolean; onToggle?: () => void;
};

/** Hairline row: number | title | description | round «+». Expands to deliverables + stack chips. */
export function ServiceRow({ num, title, description, tag, deliverables = [], stack = [], expanded, onToggle }: Props) {
  const [o, setO] = useState(false);
  const open = expanded ?? o;
  const id = useId();
  return (
    <div className={`${s.row} ${open ? s.open : ''}`}>
      <button type="button" className={s.head} aria-expanded={open} aria-controls={id} onClick={() => (onToggle ? onToggle() : setO(!o))}>
        <span className={s.num}>{num}</span>
        <span className={s.title}>{title}{tag && <Chip seal>{tag}</Chip>}</span>
        <span className={s.desc}>{description}</span>
        <span aria-hidden="true" className={s.plus}>+</span>
      </button>
      {open && (
        <div id={id} className={s.body}>
          <span className={s.spacer} />
          <p className={s.bodyDesc}>{description}</p>
          <ul className={s.list}>
            {deliverables.map((d, i) => (
              <li key={i}><span className={s.liNum}>{String(i + 1).padStart(2, '0')}</span>{d}</li>
            ))}
          </ul>
          <div className={s.stack}>{stack.map((x) => <Chip key={x}>{x}</Chip>)}</div>
        </div>
      )}
    </div>
  );
}
