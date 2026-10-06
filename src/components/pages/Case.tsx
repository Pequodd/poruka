import Link from 'next/link';
import { caseHref, PROJECTS, type Project, type Screen } from '@/data/projects';
import { BeforeAfter } from '../case/BeforeAfter';
import { BrowserScroll } from '../case/BrowserScroll';
import { CaseCover } from '../case/CaseCover';
import { clientFamily } from '@/lib/fonts';
import { ClientFont } from '../case/ClientFont';
import { CaseCaption } from '../case/Frames';
import { MobileStrip } from '../case/MobileStrip';
import { NextProject } from '../case/NextProject';
import { ScreenDetail } from '../case/ScreenDetail';
import { ScreenPair } from '../case/ScreenPair';
import { Footer } from '../layout/Footer';
import { Contact } from '../sections/Contact';
import { Lead, Section } from '../sections/Section';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { SectionMarker } from '../ui/SectionMarker';
import { Stat } from '../ui/Stat';
import s from '../case/Case.module.css';

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

function ScreenBlock({ screen: sc, n, url }: { screen: Screen; n: number; url: string }) {
  const cap = <CaseCaption n={n} label={sc.label} note={sc.note} />;
  switch (sc.type) {
    case 'scroll':
      return <div className="container"><BrowserScroll url={url} src={sc.desktop} mobileSrc={first(sc.mobile)} caption={cap} /></div>;
    case 'pair':
      return <ScreenPair url={url} desktop={sc.desktop} mobileSrc={first(sc.mobile)} caption={cap} />;
    case 'strip': {
      const labels = sc.labels || [];
      const shots = Array.isArray(sc.mobile) ? sc.mobile : [];
      const count = Math.max(labels.length, shots.length, 4);
      return <MobileStrip caption={cap} items={Array.from({ length: count }, (_, j) => ({ src: shots[j], label: labels[j] || `Экран ${j + 1}` }))} />;
    }
    case 'detail':
      return <div className="container"><ScreenDetail src={sc.desktop} crop={sc.crop} why={sc.why} caption={cap} /></div>;
    case 'beforeAfter':
      return <div className="container"><BeforeAfter before={sc.before} after={sc.after} caption={cap} /></div>;
  }
}

/**
 * Case v2 — screenshot-led case study (ui_kits/website/CaseV2.jsx).
 * Hero → Cover → Задача → Screens flow → Решения → Результат → Следующий проект → Контакт → Footer.
 */
export function Case({ project: p }: { project: Project }) {
  const c = p.case;
  const next = PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];
  const meta: [string, React.ReactNode][] = [
    ['Клиент', c.client],
    ['Год', p.year],
    ['Услуги', <div key="t" className={s.tags}>{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>],
    ['Срок', c.duration],
    ['Стек', c.stack.join(' · ')],
  ];

  return (
    <div className={s.page}>
      <ClientFont font={c.font} />

      <div className={`container ${s.intro}`}>
        <nav aria-label="Хлебные крошки" className={`${s.mono} ${s.crumbs}`}>
          <Link href="/portfolio/">Работы</Link> / <b>{p.title}</b>
        </nav>
        <h1 className={s.h1}>{p.title}</h1>
        <p className={s.oneLiner}>{c.oneLiner}</p>
      </div>

      <div className={`container ${s.metaWrap}`}>
        <div className={s.meta}>
          {meta.map(([k, v]) => (
            <div key={k} className={s.cell}>
              <span className={`${s.mono} ${s.cellLabel}`}>{k}</span>
              {typeof v === 'string' ? <span className={s.cellVal}>{v}</span> : v}
            </div>
          ))}
          <div className={s.metaBtn}><Button variant="secondary" href={`https://${c.url}`}>Открыть сайт</Button></div>
        </div>
      </div>

      <CaseCover key={p.slug} image={p.image} title={p.title} />

      <Section marker="Задача"><Lead parts={c.task} /></Section>

      <div className={s.flow}>
        {c.screens.map((sc, i) => <ScreenBlock key={i} screen={sc} n={i + 1} url={c.url} />)}
      </div>

      <div className={`container ${s.decWrap}`}>
        <div className={s.decisions}>
          <div className={s.decMarker}><SectionMarker>Решения</SectionMarker></div>
          <div className={s.decColors}>
            <span className={`${s.mono} ${s.cellLabel}`}>Цвета клиента</span>
            <div className={s.swatches}>
              {c.colors.map((col) => (
                <div key={col} className={s.swatch}>
                  <div className={s.swatchColor} style={{ background: col }} />
                  <span className={s.mono}>{col}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={s.decFont}>
            <span className={`${s.mono} ${s.cellLabel}`}>Шрифт клиента · {c.font}</span>
            <span className={s.specimen} style={{ fontFamily: `'${clientFamily(c.font)}', var(--font-sans)` }}>Аа Бб 123</span>
          </div>
          <p className={s.decText}>{c.decision}</p>
        </div>
      </div>

      <section className={s.result} data-ink>
        <div className="container">
          <div className={s.resultMarker}><SectionMarker onInk active>Результат</SectionMarker></div>
          <div className={s.stats}>{c.stats.map((x) => <Stat key={x.caption} onInk {...x} />)}</div>
          <div className={s.quoteGrid}>
            <div className={s.quote}>
              <Lead ink parts={c.quote} />
              <span className={`${s.mono} ${s.muted}`}>{c.author}</span>
            </div>
          </div>
        </div>
      </section>

      <NextProject key={next.slug} title={next.title} image={next.image} href={caseHref(next)} />
      <Contact />
      <Footer />
    </div>
  );
}
