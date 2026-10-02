import Link from 'next/link';
import s from './Button.module.css';

type Props = {
  variant?: 'primary' | 'secondary' | 'inverse';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  arrow?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  external?: boolean;
};

export function Button({ variant = 'primary', children, href, onClick, disabled, fullWidth, arrow = true, type = 'button', className, external }: Props) {
  const cls = [s.btn, s[variant], fullWidth && s.full, !arrow && s.noArrow, className].filter(Boolean).join(' ');
  const inner = (
    <>
      {children}
      {arrow && <span aria-hidden="true" className={s.arrow}>↗</span>}
    </>
  );
  if (href) {
    if (external || /^(https?:|mailto:|tel:)/.test(href))
      return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>;
    return <Link href={href} className={cls} onClick={onClick}>{inner}</Link>;
  }
  return <button type={type} className={cls} onClick={onClick} disabled={disabled}>{inner}</button>;
}
