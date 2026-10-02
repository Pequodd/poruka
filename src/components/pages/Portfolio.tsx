'use client';
import Link from 'next/link';
import { useState } from 'react';
import { caseHref, FILTERS, PROJECTS, type Project } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useIsMobile } from '@/lib/hooks';
import { Footer } from '../layout/Footer';
import { Lead } from '../sections/Section';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Placeholder } from '../ui/Placeholder';
import { ProjectCard } from '../ui/ProjectCard';
import s from './Portfolio.module.css';

/** Grid rhythm 8+4 / 4+4+4 / 4+8. */
const PATTERN: [number, string][] = [[8, '16/10'], [4, '3/4'], [4, '1/1'], [4, '1/1'], [4, '1/1'], [4, '3/4'], [8, '16/10']];

function ListRow({ p }: { p: Project }) {
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <Link href={caseHref(p)} className={s.row} onMouseMove={move}>
      <span className="mono secondary">{p.year}</span>
      <span className={s.rowTitle}>{p.title}</span>
      <span className="mono">{p.cat}</span>
      <span className={s.rowServices}>{p.services}</span>
      <span className={s.rowArrow} aria-hidden="true">↗</span>
      <div className={s.rowPreview} aria-hidden="true">
        {p.image ? <img src={asset(p.image)} alt="" className={s.rowImg} loading="lazy" /> : <Placeholder ratio="4/3" />}
      </div>
    </Link>
  );
}

export function Portfolio() {
  const [f, setF] = useState<string>('Все');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const mobile = useIsMobile();
  const list = PROJECTS.filter((p) => f === 'Все' || p.cat === f);
  return (
    <div className={s.page}>
      <div className={`container ${s.intro}`}>
        <div className={s.introGrid}>
          <h1 className={s.h1}>Работы<sup className={s.count}>({String(PROJECTS.length).padStart(2, '0')})</sup></h1>
          <div className={s.lead}><Lead parts={['Проекты, за которые мы ручаемся.', ' Каждый — с задачей, решением и результатом.']} /></div>
        </div>
      </div>
      <div className={s.bar}>
        <div className={`container ${s.barInner}`}>
          <div className={s.filters} role="group" aria-label="Фильтр по категории">
            {FILTERS.map((x) => <Chip key={x} size="md" active={f === x} onClick={() => setF(x)}>{x}</Chip>)}
          </div>
          <div className={s.views} role="group" aria-label="Вид">
            <Chip size="md" active={view === 'grid'} onClick={() => setView('grid')}>Сетка</Chip>
            <Chip size="md" active={view === 'list'} onClick={() => setView('list')}>Список</Chip>
          </div>
        </div>
      </div>
      <div className={`container ${s.list}`}>
        {list.length === 0 && <p className={s.empty}>В этой категории пока нет проектов.</p>}
        {view === 'list' && !mobile ? (
          <div className={s.rows}>{list.map((p) => <ListRow key={p.slug} p={p} />)}</div>
        ) : (
          <div className={s.grid}>
            {list.map((p, i) => {
              const [span, ratio] = PATTERN[i % PATTERN.length];
              return (
                <div key={p.slug} className={span === 8 ? s.span8 : s.span4}>
                  <ProjectCard title={p.title} meta={p.meta} result={p.result} image={p.image} ratio={mobile ? '4/5' : ratio} href={caseHref(p)} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <section className={s.cta}>
        <div className={`container ${s.ctaInner}`}>
          <h2 className={s.ctaH2}>Хотите такой же<br />результат?</h2>
          <Button variant="inverse" href="/#contact" className={s.ctaBtn}>Обсудить проект</Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
