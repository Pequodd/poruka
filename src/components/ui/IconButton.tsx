import s from './IconButton.module.css';

type Props = { icon?: string; tone?: 'dark' | 'light'; size?: number; label: string; onClick?: () => void; href?: string; as?: 'span' };

/** 56px round glyph button. Inside an element with class `icon-hover`, it reacts to the parent's hover. */
export function IconButton({ icon = '↗', tone = 'dark', size = 56, label, onClick, href, as }: Props) {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  const cls = `${s.btn} ${s[tone]}`;
  const glyph = <span aria-hidden="true" className={`${s.glyph} ${icon === '↗' ? s.rot : ''}`}>{icon}</span>;
  if (as === 'span') return <span className={cls} style={style}>{glyph}</span>;
  if (href) return <a href={href} aria-label={label} className={cls} style={style}>{glyph}</a>;
  return <button type="button" aria-label={label} onClick={onClick} className={cls} style={style}>{glyph}</button>;
}
