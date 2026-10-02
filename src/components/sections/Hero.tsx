'use client';
import { useRef } from 'react';
import { CONTACTS } from '@/data/content';
import { useOn } from '@/lib/hooks';
import { Button } from '../ui/Button';
import { SectionMarker } from '../ui/SectionMarker';
import { Guilloche } from './Guilloche';
import s from './Hero.module.css';

const WORDS: { t: string; grey?: boolean }[] = [
  { t: 'Проектируем' }, { t: 'и запускаем' }, { t: 'сайты,' }, { t: 'за которые', grey: true },
];

const fade = (d: number, y = 16) => ({ ['--fd' as string]: `${d}ms`, ['--fy' as string]: `${y}px` });

export function Hero() {
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const on = useOn(400);
  return (
    <section
      className={`${s.hero} ${on ? s.on : ''}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      }}
    >
      <div className={s.bg}><Guilloche pointer={pointer} className={s.canvas} /></div>
      <div className={`container ${s.inner}`}>
        <div className={s.fade} style={fade(0, 12)}><SectionMarker active>Цифровая студия · Челябинск → мир</SectionMarker></div>
        <h1 className={s.h1}>
          {WORDS.map((w, i) => (
            <span key={i}>
              <span className={s.mask}><span className={`${s.word} ${w.grey ? s.grey : ''}`} style={{ ['--d' as string]: `${i * 60}ms` }}>{w.t}</span></span>{' '}
            </span>
          ))}
          <span className={s.last}>
            <span className={s.mask}><span className={s.word} style={{ ['--d' as string]: '240ms' }}>ручаемся.</span></span>
            <span aria-hidden="true" className={s.underline} />
          </span>
        </h1>
        <div className={`${s.ctas} ${s.fade}`} style={fade(700)}>
          <Button href="/#contact" className={s.ctaBtn}>Обсудить проект</Button>
          <div className={`${s.stack} mono`}>
            <span>WordPress</span><span className={s.dim}>·</span><span>1С‑Битрикс</span><span className={s.dim}>·</span><span>AI</span>
          </div>
        </div>
        <div className={`${s.row} ${s.fade} mono`} style={fade(900, 0)}>
          {['Дизайн', 'Разработка', 'AI', 'Поддержка'].map((t, i) => <span key={t}><b>0{i + 1}</b>&nbsp;&nbsp;{t}</span>)}
        </div>
      </div>
      <aside className={`${s.card} ${s.fade}`} style={fade(1300, 24)}>
        <div className={s.cardTop}>
          <span className={`${s.live} mono`}><span className={s.liveDot} />На связи</span>
          <span className="mono secondary">Ответ за день</span>
        </div>
        <p className={s.cardText}><b>Пишите напрямую</b> — тем, кто делает проект. Без менеджеров.</p>
        <Button variant="secondary" fullWidth href={CONTACTS.telegramUrl}>Telegram</Button>
      </aside>
    </section>
  );
}
