'use client';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import { useProgress } from '../v7/useProgress';
import { BrowserFrame } from './Frames';
import s from './Case.module.css';

const Shot = ({ src, label, alt = '' }: { src?: string; label: string; alt?: string }) =>
  src ? <img src={asset(src)} alt={alt} className={s.cover} loading="lazy" /> : <Placeholder ratio="auto" label={label} className={s.phFill} />;

/** Scroll progress of the block as it passes the viewport → --k (0 entering … 1 centred), for the settle-in motion. */
function useSettle() {
  const ref = useRef<HTMLDivElement>(null);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--k', Math.min(1, p * 2.2).toFixed(3)));
  return ref;
}

/** «Крупный экран»: one browser window across the full content width, 16:10; grows from 0.9 to full size as it enters. */
export function ScreenWide({ url, src, caption }: { url?: string; src?: string; caption: React.ReactNode }) {
  const ref = useSettle();
  return (
    <div ref={ref} className={s.wide}>
      <div className="container">{caption}</div>
      <div className={s.wideStage}>
        <BrowserFrame url={url} className={s.wideBrowser}><Shot src={src} label="СКРИНШОТ 1440 × 900 · ПЕРВЫЙ ЭКРАН" /></BrowserFrame>
      </div>
    </div>
  );
}

/** «Экран на цветном фоне»: a full-bleed band in the client's colour, the screenshot floats large without chrome and straightens up on scroll. */
export function ScreenStage({ src, bg, caption }: { src?: string; bg?: string; caption: React.ReactNode }) {
  const ref = useSettle();
  return (
    <div ref={ref}>
      <div className="container">{caption}</div>
      <div className={s.band} style={{ ['--bg' as string]: bg || 'var(--accent-ultra)' }}>
        <div className={s.bandShot}><Shot src={src} label="СКРИНШОТ 1440 × 900" /></div>
      </div>
    </div>
  );
}

/** «Сетка экранов»: one large screen and two small ones beside it (stacked on phones). */
export function ScreenGrid({ images = [], caption }: { images?: string[]; caption: React.ReactNode }) {
  return (
    <div className="container">
      {caption}
      <div className={s.bento}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${s.bentoCell} ${i === 0 ? s.bentoMain : ''}`}><Shot src={images[i]} label={i === 0 ? 'ГЛАВНЫЙ ЭКРАН' : `ЭКРАН ${i + 1}`} /></div>
        ))}
      </div>
    </div>
  );
}

/** «Текстовая вставка»: a large statement between screens — a small label, the phrase, an optional paragraph. */
export function ScreenText({ title, eyebrow, body }: { title: string; eyebrow?: string; body?: string }) {
  return (
    <div className={`container ${s.insert}`}>
      {eyebrow && <span className={`mono ${s.insertEyebrow}`}>{eyebrow}</span>}
      <p className={s.insertTitle}>{title}</p>
      {body && <p className={s.insertBody}>{body}</p>}
    </div>
  );
}
