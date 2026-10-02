import { CONTACTS as C } from '@/data/content';
import { Wordmark } from '../ui/Wordmark';
import s from './Footer.module.css';

const SOCIAL: Record<string, string> = { Telegram: C.telegramUrl, Behance: 'https://www.behance.net/', 'VC.ru': 'https://vc.ru/' };

export function Footer() {
  const col = (t: string, items: [string, string?][]) => (
    <div className={s.col}>
      <span className={`${s.m} ${s.head}`}>{t}</span>
      {items.map(([label, href]) => href
        ? <a key={label} href={href} className={`${s.m} ${s.link}`} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{label}</a>
        : <span key={label} className={`${s.m} ${s.link}`}>{label}</span>)}
    </div>
  );
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.cols}>
          {col('Контакты', [[C.email, `mailto:${C.email}`], [C.telegram, C.telegramUrl]])}
          {col('Телефон', [[C.phone, `tel:${C.phone.replace(/[^+\d]/g, '')}`]])}
          {col('Соцсети', C.socials.map((x) => [x, SOCIAL[x]]))}
          {col('Студия', [[C.city], [`© ${C.year} Порука`]])}
        </div>
      </div>
      <div className={`container ${s.mark}`}><Wordmark /></div>
    </footer>
  );
}
