import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

export const DESKTOP_PH = 'СКРИНШОТ 1440 × ПОЛНАЯ ВЫСОТА';
export const MOBILE_PH = 'СКРИНШОТ 390 × ПОЛНАЯ ВЫСОТА';

/** Caption on a 1px hairline: mono «01 — Главная» left, one phrase right (stacked on mobile). */
export function CaseCaption({ n, label, note }: { n: number; label: string; note?: string }) {
  return (
    <div className={s.caption}>
      <span className={`${s.mono} ${s.capLabel}`}>{String(n).padStart(2, '0')} — {label}</span>
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

/** Minimal browser chrome: 1px hairline, 28px bar, three 6px dots, centred mono address. No shadow, radius 0. */
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
