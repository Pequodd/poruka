import Link from 'next/link';
import { caseHref, PROJECTS, type Project } from '@/data/projects';
import { asset } from '@/lib/asset';
import { Footer } from '../layout/Footer';
import { Contact } from '../sections/Contact';
import { Lead, Section } from '../sections/Section';
import { Chip } from '../ui/Chip';
import { IconButton } from '../ui/IconButton';
import { Placeholder } from '../ui/Placeholder';
import { SectionMarker } from '../ui/SectionMarker';
import { ServiceRow } from '../ui/ServiceRow';
import { Stat } from '../ui/Stat';
import s from './Case.module.css';

/** Case study template (Case.jsx). Showcase slots stay placeholders until the studio supplies case imagery. */
export function Case({ project: p }: { project: Project }) {
  const c = p.case;
  const idx = PROJECTS.indexOf(p);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const meta: [string, React.ReactNode][] = [
    ['Клиент', <span key="c" className={s.cellVal}>{c.client}</span>],
    ['Год', <span key="y" className={s.cellVal}>{p.year}</span>],
    ['Услуги', <div key="t" className={s.tags}>{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>],
    ['Срок', <span key="d" className={s.cellVal}>{c.duration}</span>],
  ];
  return (
    <div className={s.page}>
      <div className={`container ${s.intro}`}>
        <nav aria-label="Хлебные крошки" className={`mono ${s.crumbs}`}>
          <Link href="/portfolio/">Работы</Link> / <b>{p.title}</b>
        </nav>
        <h1 className={s.h1}>{c.heading[0]}<br />{c.heading[1]}</h1>
        <p className={s.lead}>{c.lead}</p>
      </div>

      {p.image ? <img src={asset(p.image)} alt={`${p.title} — обложка проекта`} className={s.cover} /> : <Placeholder ratio="16/9" />}

      <div className="container">
        <div className={s.meta}>
          {meta.map(([k, v]) => (
            <div key={k} className={s.cell}>
              <span className="mono secondary">{k}</span>
              {v}
              {k === 'Срок' && c.url && <a href={c.url} className="mono" target="_blank" rel="noreferrer">Открыть сайт ↗</a>}
            </div>
          ))}
        </div>
      </div>

      <Section marker="Задача"><Lead parts={c.task.filter(Boolean) as string[]} /></Section>
      <Section marker="Решение" style={{ paddingTop: 0 }}>
        <p className={s.solution}>{c.solution}</p>
        <div className={s.rows}>
          {c.steps.map(([n, t, d]) => <ServiceRow key={n} num={n} title={t} description={d} deliverables={[d]} />)}
        </div>
      </Section>

      <div className={s.show}>
        <Placeholder ratio="21/9" />
        <div className={`container ${s.two}`}><Placeholder ratio="4/5" /><Placeholder ratio="4/5" /></div>
        <div className={s.white}>
          <div className={`container ${s.devices}`}><Placeholder ratio="16/10" label="DESKTOP 16:10" /><Placeholder ratio="9/19" label="MOBILE" /></div>
        </div>
        <div className={`container ${s.refs}`}>{[1, 2, 3, 4, 5, 6].map((i) => <Placeholder key={i} ratio="1/1" />)}</div>
        <div className={`container ${s.brand}`}>
          <div className={s.brandGrid}>
            <div className={s.brandCol}>
              <span className="mono secondary">Цвета клиента</span>
              <div className={s.swatches}>{['#1B3A6B', '#E8B23A', '#F5F1EA', '#222'].map((x) => <div key={x} style={{ background: x }} />)}</div>
            </div>
            <div className={s.brandCol}>
              <span className="mono secondary">Шрифт клиента</span>
              <span className={s.font}>Аа Бб 123</span>
            </div>
          </div>
        </div>
      </div>

      <section className={s.result}>
        <div className="container">
          <div className={s.resultMarker}><SectionMarker onInk active>Результат</SectionMarker></div>
          <div className={s.stats}>{c.stats.map((x) => <Stat key={x.caption} onInk {...x} />)}</div>
          <div className={s.quoteGrid}>
            <div className={s.quote}>
              <Lead ink parts={c.quote} />
              <span className={`mono ${s.muted}`}>{c.quoteAuthor}</span>
            </div>
          </div>
          <Link href={caseHref(next)} className={`${s.next} icon-hover`}>
            <div className={s.nextCard}>
              <div className={s.nextText}>
                <span className={`mono ${s.muted}`}>Следующий проект</span>
                <span className={s.nextTitle}>{next.title}</span>
              </div>
              <IconButton as="span" tone="light" label="Следующий проект" />
            </div>
          </Link>
        </div>
      </section>
      <Contact />
      <Footer />
    </div>
  );
}
