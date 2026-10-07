import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

export const DESKTOP_PH = 'СКРИНШОТ 1440 × ПОЛНАЯ ВЫСОТА';
export const MOBILE_PH = 'СКРИНШОТ 390 × ПОЛНАЯ ВЫСОТА';

/** Caption on a hairline: mono «(01/05)» with the screen name on the left, one phrase on the right (stacked on mobile). */
export function CaseCaption({ n, total, label, note }: { n: number; total?: number; label: string; note?: string }) {
  const pad = (x: number) => String(x).padStart(2, '0');
  return (
    <div className={s.caption}>
      <span className={s.capLabel}><span className="mono">({pad(n)}{total ? `/${pad(total)}` : ''})</span>{label}</span>
      {note && <span className={s.capNote}>{note}</span>}
    </div>
  );
}

type BrowserProps = {
  url?: string;
  children: React.ReactNode;
  className?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
};

/** Browser chrome in the v7 system: rounded window, frosted 32px bar with three dots and a centred mono address. */
export function BrowserFrame({ url, children, className, viewportRef }: BrowserProps) {
  return (
    <div className={`${s.browser} ${className || ''}`}>
      <div className={s.bar} aria-hidden="true">
        <span className={s.dotB} /><span className={s.dotB} /><span className={s.dotB} />
        {url && <span className={s.url}>{url}</span>}
      </div>
      <div ref={viewportRef} className={s.viewport}>{children}</div>
    </div>
  );
}

/** Phone without notch: 9:19.5, radius 32, 1px hairline, 6px bezel; screenshot top-aligned. */
export function PhoneFrame({ src, alt = '', className, style }: { src?: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`${s.phone} ${className || ''}`} style={style}>
      <div className={s.phoneScreen}>
        {src ? <img src={asset(src)} alt={alt} className={s.cover} loading="lazy" /> : <Placeholder ratio="auto" label={MOBILE_PH} className={s.phFill} />}
      </div>
    </div>
  );
}
