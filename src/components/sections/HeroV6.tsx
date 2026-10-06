'use client';
import { useOn } from '@/lib/hooks';
import { Button } from '../ui/Button';
import { Seal3D } from './Seal3D';
import s from './HeroV6.module.css';

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

/** Home v6 first screen — headline on three ruled lines, offset on the grid; the 3D seal stamps the page. */
export function HeroV6() {
  const on = useOn(150);
  return (
    <section className={`${s.hero} ${on ? s.on : ''}`} aria-label="Порука — цифровая студия">
      <div className={`mono ${s.top}`}>
        <span><span className={s.dot} aria-hidden="true" />Цифровая студия</span>
        <span className={s.muted}>Челябинск → мир<span className={s.long}> · с ответственностью за результат</span></span>
      </div>

      <h1 className={s.rows} aria-label="Сайты, за которые мы ручаемся.">
        <span className={`${s.row} ${s.r1}`} style={d(0)} aria-hidden="true">
          <span className={s.text}><span className={s.mask}><span className={s.slide} style={d(120)}>Сайты,</span></span></span>
          <span className={`mono ${s.note}`} style={d(900)}><b>(01)</b> UI/UX‑дизайн</span>
        </span>
        <span className={`${s.row} ${s.r2}`} style={d(120)} aria-hidden="true">
          <span className={`mono ${s.note}`} style={d(1000)}><b>(02)</b> WordPress · 1С‑Битрикс</span>
          <span className={s.text}><span className={s.mask}><span className={s.slide} style={d(220)}>за&nbsp;которые</span></span></span>
        </span>
        <span className={`${s.row} ${s.r3}`} style={d(240)} aria-hidden="true">
          <span className={`${s.text} ${s.grey}`}>
            <span className={s.mask}><span className={s.slide} style={d(320)}>мы&nbsp;</span></span>
            <span className={s.mark}><span className={s.mask}><span className={s.slide} style={d(380)}>ручаемся.</span></span><span className={s.underline} /></span>
          </span>
          <span className={`mono ${s.note}`} style={d(1100)}><b>(03)</b> Разработка с&nbsp;AI</span>
        </span>
        <span className={s.seal} aria-hidden="true"><Seal3D center="ПРИНЯТО" /></span>
      </h1>

      <div className={s.bottom}>
        <p className={`${s.lead} ${s.fade}`} style={d(700)}><b>Студия из трёх человек.</b> Проектируем и запускаем сайты для малого и среднего бизнеса и отвечаем за результат своим именем.</p>
        <div className={`${s.btns} ${s.fade}`} style={d(820)}>
          <Button href="/#contact">Обсудить проект</Button>
          <Button variant="secondary" href="/portfolio/">Смотреть работы</Button>
        </div>
      </div>
    </section>
  );
}
