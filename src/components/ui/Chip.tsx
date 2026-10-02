import s from './Chip.module.css';

type Props = {
  children: React.ReactNode;
  active?: boolean;
  seal?: boolean;
  onInk?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function Chip({ children, active, seal, onInk, onClick, size = 'sm', className }: Props) {
  const cls = [s.chip, onInk && s.onInk, active && s.active, seal && s.seal, size !== 'sm' && s[size], className].filter(Boolean).join(' ');
  if (onClick) return <button type="button" className={cls} aria-pressed={!!active} onClick={onClick}>{children}</button>;
  return <span className={cls}>{children}</span>;
}
