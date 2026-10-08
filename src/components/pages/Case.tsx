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
import { ScreenGrid, ScreenStage, ScreenText, ScreenWide } from '../case/ScreenBig';
import { ScreenPair } from '../case/ScreenPair';
import { Chip } from '../ui/Chip';
import { ContactV7 } from '../v7/ContactV7';
import { FooterV7 } from '../v7/FooterV7';
import { Letters } from '../v7/Letters';
import { Look } from '../v7/Look';
import { Orbit } from '../v7/Orbit';
import v from '../v7/V7.module.css';
import s from '../case/Case.module.css';

const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'экран' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'экрана' : 'экранов');
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

function ScreenBlock({ screen: sc, n, total, url, accent }: { screen: Screen; n: number; total: number; url: string; accent?: string }) {
  const cap = <CaseCaption n={n} total={total} label={sc.label} note={sc.note} />;
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
    case 'wide':
      return <ScreenWide url={url} src={sc.desktop} caption={cap} />;
    case 'stage':
      return <ScreenStage src={sc.desktop} bg={sc.bg || accent} caption={cap} />;
    case 'grid':
      return <ScreenGrid images={sc.images} caption={cap} />;
    case 'text':
      return <ScreenText title={sc.label} eyebrow={sc.note} body={sc.why} />;
    case 'beforeAfter':
      return <div className="container"><BeforeAfter before={sc.before} after={sc.after} caption={cap} /></div>;
  }
}

/**
 * Case in the v7 system (structure from Case v2): assembling uppercase title over the glass links → glass facts panel →
 * cover → (01) Задача → (02) Экраны → (03) Решения → (04) Результат on ultramarine → next project → contact → footer.
 */
export function Case({ project: p }: { project: Project }) {
  const c = p.case;
  const others = PROJECTS.filter((x) => x.slug !== p.slug);
  const at = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = at >= 0 ? PROJECTS[(at + 1) % PROJECTS.length] : others[0];
  // Every field can be empty while a case is being filled in the admin — empty rows and sections are skipped.
  const meta = ([
    ['Клиент', c.client],
    ['Год', p.year],
    ['Услуги', c.tags.length ? <div key="t" className={s.tags}>{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div> : ''],
    ['Срок', c.duration],
    ['Стек', c.stack.join(', ')],
  ] as [string, React.ReactNode][]).filter(([, val]) => val);
  const hasQuote = c.quote.join('').trim();
  // Text inserts sit between screens but aren't numbered as screens.
  const shots = c.screens.filter((sc) => sc.type !== 'text');

  return (
    <div className={v.page}>
      <Look />
      <Orbit />
      {c.font && <ClientFont font={c.font} />}
      <div className={v.content}>
        {/* Everything from the title to the next project shares one width: the 1440px browser frame. */}
        <div className={s.frame}>
        <header className={s.intro} data-orbit="30 -14 0.6 0 1" data-orbit-m="24 -30 0.5 0 0.8">
          <nav aria-label="Хлебные крошки" className={`mono ${s.crumbs}`} style={{ ['--d' as string]: '150ms' }} data-hero>
            <Link href="/portfolio/">Работы</Link><span aria-hidden="true"> / </span><b>{p.title}</b>
          </nav>
          <h1 className={s.h1} aria-label={p.title}><span aria-hidden="true"><Letters text={p.title} /></span></h1>
          <p className={s.oneLiner} style={{ ['--d' as string]: '700ms' }} data-hero>{c.oneLiner}</p>
          <div className={`${v.glass} ${s.meta}`} style={{ ['--d' as string]: '850ms' }} data-hero>
            {meta.map(([k, val]) => (
              <div key={k} className={s.cell}>
                <span className={`mono ${s.cellLabel}`}>{k}</span>
                {typeof val === 'string' ? <span className={s.cellVal}>{val}</span> : val}
              </div>
            ))}
            {c.url && <a className={s.siteBtn} href={`https://${c.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">Открыть сайт<span className={s.siteIcon} aria-hidden="true">↗</span></a>}
          </div>
        </header>

        <div data-orbit="30 0 0.8 20 0">
          <CaseCover key={p.slug} image={p.image} title={p.title} />
        </div>

        {c.task.join('').trim() && <section className={s.task}>
          <span className={`mono ${v.eyebrow}`} data-rv>(01) Задача</span>
          <p className={s.taskText} data-rv style={{ ['--d' as string]: '80ms' }}>
            <span className={s.taskKey}>{c.task[0]}</span>{c.task.slice(1).join('')}
          </p>
        </section>}

        {c.screens.length > 0 && <section className={s.flow} aria-label="Экраны">
          <div className={s.flowHead}>
            <span className={`mono ${v.eyebrow}`} data-rv>(02) Экраны</span>
            <span className={`mono ${v.eyebrow}`} data-rv>{shots.length} {plural(shots.length)}</span>
          </div>
          {c.screens.map((sc, i) => <div key={i} data-rv><ScreenBlock screen={sc} n={shots.indexOf(sc) + 1} total={shots.length} url={c.url} accent={c.colors[0]} /></div>)}
        </section>}

        {(c.colors.length > 0 || c.font || c.decision) && <section className={s.decWrap}>
          <span className={`mono ${v.eyebrow}`} data-rv>(03) Решения</span>
          <div className={s.decisions}>
            {c.colors.length > 0 && <div className={`${v.glass} ${s.decCard}`} data-rv>
              <span className={`mono ${s.cellLabel}`}>Цвета клиента</span>
              <div className={s.swatches}>
                {c.colors.map((col, i) => (
                  <div key={i} className={s.swatch}>
                    <div className={s.swatchColor} style={{ background: col }} />
                    <span className="mono">{col}</span>
                  </div>
                ))}
              </div>
            </div>}
            {c.font && <div className={`${v.glass} ${s.decCard}`} data-rv style={{ ['--d' as string]: '90ms' }}>
              <span className={`mono ${s.cellLabel}`}>Шрифт клиента: {c.font}</span>
              <span className={s.specimen} style={{ fontFamily: `'${clientFamily(c.font)}', var(--font-sans)` }}>Аа Бб 123</span>
            </div>}
            <p className={s.decText} data-rv style={{ ['--d' as string]: '180ms' }}>{c.decision}</p>
          </div>
        </section>}

        {(c.stats.length > 0 || hasQuote) && <section className={s.result} data-ink>
          <span className={`mono ${s.resultEyebrow}`} data-rv>(04) Результат</span>
          <div className={s.stats}>
            {c.stats.map((x, i) => (
              <div key={i} className={s.stat} data-rv style={{ ['--d' as string]: `${i * 90}ms` }}>
                <b className={s.statValue}>{x.value}{x.suffix}</b>
                <span className={s.statCaption}>{x.caption}</span>
              </div>
            ))}
          </div>
          {hasQuote && <blockquote className={s.quote} data-rv>
            <p>{c.quote.join('')}</p>
            {c.author && <cite className="mono">{c.author}</cite>}
          </blockquote>}
        </section>}

        {next && <NextProject key={next.slug} title={next.title} image={next.image} href={caseHref(next)} />}
        </div>
        <ContactV7 eyebrow="(05) Контакт" />
        <FooterV7 />
      </div>
    </div>
  );
}
