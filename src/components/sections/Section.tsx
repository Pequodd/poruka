import { SectionMarker } from '../ui/SectionMarker';
import s from './Section.module.css';

type Props = { marker?: string; ink?: boolean; children: React.ReactNode; id?: string; className?: string; style?: React.CSSProperties };

/** Heading guide: marker in cols 1–3, content from col 5. */
export function Section({ marker, ink, children, id, className, style }: Props) {
  return (
    <section id={id} className={[s.section, ink && s.ink, className].filter(Boolean).join(' ')} style={style}>
      <div className="container">
        <div className={s.grid}>
          <div className={s.marker}>{marker && <SectionMarker onInk={ink}>{marker}</SectionMarker>}</div>
          <div className={s.content}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function H2({ children, ink, count }: { children: React.ReactNode; ink?: boolean; count?: string }) {
  return <h2 className={`${s.h2} ${ink ? s.h2Ink : ''}`}>{children}{count && <sup className={s.count}>{count}</sup>}</h2>;
}

/** Two-tone statement: even parts in primary, odd parts in secondary. */
export function Lead({ parts, ink }: { parts: React.ReactNode[]; ink?: boolean }) {
  return (
    <p className={`${s.lead} ${ink ? s.leadInk : ''}`}>
      {parts.map((p, i) => <span key={i} className={i % 2 === 0 ? s.key : undefined}>{p}</span>)}
    </p>
  );
}
