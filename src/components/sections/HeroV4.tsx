'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SERVICES, STEPS } from '@/data/content';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useOn, useReducedMotion } from '@/lib/hooks';
import { Button } from '../ui/Button';
import { Process3D } from './Process3D';
import { Seal3D } from './Seal3D';
import s from './HeroV4.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

/** Home v4 first screen — «studio bento»: hairline grid, cells widen under the cursor, two 3D objects. */
export function HeroV4() {
  const on = useOn(150);
  const rm = useReducedMotion();
  const [step, setStep] = useState(0);
  const latest = PROJECTS[0];

  // The process object re-forms through the 8 steps on its own.
  useEffect(() => {
    if (rm) return;
    const t = setInterval(() => setStep((x) => (x + 1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, [rm]);

  return (
    <section className={`${s.hero} ${on ? s.on : ''}`} aria-label="Порука — цифровая студия">
      <div className={s.grid}>
        <div className={`${s.row} ${s.top}`}>
          <div className={`${s.cell} ${s.a}`} style={delay(0)}>
            <div className={`${s.mono} ${s.head}`}>
              <span><span className={s.dot} aria-hidden="true" />Цифровая студия</span>
              <span className={s.muted}>Челябинск → мир</span>
            </div>
            <h1 className={s.h1}>
              Сайты, за&nbsp;которые <span className={s.grey}>мы&nbsp;<span className={s.mark}>ручаемся.<span aria-hidden="true" className={s.underline} /></span></span>
            </h1>
            <div className={s.foot}>
              <p className={s.lead}><b>UI/UX‑дизайн, WordPress и 1С‑Битрикс, разработка с&nbsp;AI.</b> Три человека без менеджеров — отвечаем за результат своим именем.</p>
              <div className={s.btns}>
                <Button href="/#contact">Обсудить проект</Button>
                <Button variant="secondary" href="/portfolio/">Смотреть работы</Button>
              </div>
            </div>
          </div>

          <div className={`${s.cell} ${s.b}`} style={delay(120)}>
            <div className={s.scene}><Process3D step={step} rootMargin="0px" /></div>
            <div className={`${s.mono} ${s.bHead}`}>
              <span><span className={s.dot} aria-hidden="true" />Процесс</span>
              <span className={s.muted} aria-live="polite">({pad(step + 1)}/{pad(STEPS.length)})</span>
            </div>
            <div className={s.bFoot}>
              <span key={step} className={s.stepTitle}>{STEPS[step].title}</span>
              <a href="#process" className={`${s.mono} ${s.bLink}`}>Как мы работаем ↓</a>
            </div>
          </div>
        </div>

        <div className={`${s.row} ${s.bottom}`}>
          <div className={`${s.cell} ${s.c1}`} style={delay(240)}>
            <span className={`${s.mono} ${s.muted}`}>Проектов запущено</span>
            <span className={s.statNum}>40<sup>+</sup></span>
          </div>

          <div className={`${s.cell} ${s.c2}`} style={delay(300)}>
            <div className={s.sealWrap}><Seal3D center="10+" /></div>
            <div className={`${s.mono} ${s.head}`}><span>Ручаемся</span><span className={s.muted}>10+ лет</span></div>
            <span className={`${s.mono} ${s.muted} ${s.sealHint}`}>Наведите — поставим печать</span>
          </div>

          <Link href={caseHref(latest)} className={`${s.cell} ${s.c3}`} style={delay(360)}>
            {latest.image && <img src={asset(latest.image)} alt="" className={s.cover} />}
            <span className={`${s.mono} ${s.tag}`}>Последняя работа</span>
            <span className={s.capBar}>
              <span className={s.capTitle}>{latest.title} <span>({latest.year})</span></span>
              <span className={`${s.mono} ${s.arr}`} aria-hidden="true">↗</span>
            </span>
          </Link>

          <div className={`${s.cell} ${s.c4}`} style={delay(420)}>
            <span className={`${s.mono} ${s.muted}`}>Делаем</span>
            <ul className={s.list}>
              {SERVICES.slice(0, 4).map((x) => <li key={x.num}><span className={s.mono}>{x.num}</span>{x.title}</li>)}
            </ul>
            <a href="#services" className={`${s.mono} ${s.more}`}>Все услуги ↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}
