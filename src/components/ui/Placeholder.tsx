import s from './Placeholder.module.css';

type Props = { ratio?: string; label?: string; tone?: 'light' | 'dark'; className?: string; style?: React.CSSProperties; children?: React.ReactNode };

/** Flat image slot until photography is supplied. */
export function Placeholder({ ratio = '4/3', label, tone = 'light', className, style, children }: Props) {
  const txt = label === '' ? null : label || 'ИЗОБРАЖЕНИЕ ' + ratio.replace('/', ':');
  return (
    <div className={[s.ph, tone === 'dark' && s.dark, className].filter(Boolean).join(' ')} style={{ aspectRatio: ratio === 'auto' ? undefined : ratio, ...style }}>
      {txt && <span className={s.label}>{txt}</span>}
      {children}
    </div>
  );
}
