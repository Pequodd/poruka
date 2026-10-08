'use client';
import Link from 'next/link';
import { useState } from 'react';
import { caseHref, FILTERS, PROJECTS, type Project } from '@/data/projects';
import { asset } from '@/lib/asset';
import { useIsMobile } from '@/lib/hooks';
import { Chip } from '../ui/Chip';
import { ContactV7 } from '../v7/ContactV7';
import { FooterV7 } from '../v7/FooterV7';
import { Letters } from '../v7/Letters';
import { Look } from '../v7/Look';
import { Orbit } from '../v7/Orbit';
import v from '../v7/V7.module.css';
import s from './Portfolio.module.css';

/** Grid rhythm 8+4 / 4+4+4 / 4+8. */
// Column spans per row (8+4, 4+4+4, 4+8); every card in a row has the same height (grid-auto-rows), so neighbours never stretch.
const PATTERN: [number][] = [[8], [4], [4], [4], [4], [4], [8]];
const pad = (n: number) => String(n).padStart(2, '0');

/** Case card in the v7 system: rounded media, the facts on a glass plate inside it; brand-colour tile when there is no shot. */
function WorkCard({ p, ratio, i }: { p: Project; ratio?: string; i: number }) {
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  const [bg, fg] = p.case.colors;
  return (
    <Link href={caseHref(p)} className={s.card} style={{ aspectRatio: ratio, ['--i' as string]: i }} onMouseMove={move}>
      <div className={s.zoom}>
        {p.image
          ? <img src={asset(p.image)} alt="" className={s.img} loading="lazy" />
          : <div className={s.tile} style={{ background: bg, color: fg }}><span>{p.case.client.replace(/ \(NDA\)/, '')}</span></div>}
      </div>
      <div className={`${v.glass} ${s.plate}`}>
        <span className={`mono ${s.plateMeta}`}>{p.year} · {p.cat}</span>
        <span className={s.plateTitle}>{p.title}</span>
        <span className={s.plateResult}>{p.result}</span>
      </div>
      <span className={s.cursor} aria-hidden="true">Смотреть</span>
    </Link>
  );
}

function ListRow({ p }: { p: Project }) {
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <Link href={caseHref(p)} className={s.row} onMouseMove={move}>
      <span className={s.rowTitle}>{p.title}</span>
      <span className={s.rowCell}>{p.services}</span>
      <span className={s.rowCell}>{p.cat}</span>
      <span className={s.rowResult}>{p.result}</span>
      <span className={`mono ${s.rowYear}`}>{p.year}</span>
      <div className={s.rowPreview} aria-hidden="true">
        {p.image ? <img src={asset(p.image)} alt="" className={s.rowImg} loading="lazy" /> : <div className={s.rowTile} style={{ background: p.case.colors[0] }} />}
      </div>
    </Link>
  );
}

/** Portfolio in the v7 system: assembling title + the glass links, glass filter capsule, rounded cards, closing call. */
export function Portfolio() {
  const [f, setF] = useState<string>('Все');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const mobile = useIsMobile();
  const list = PROJECTS.filter((p) => f === 'Все' || p.cat === f);
  return (
    <div className={v.page}>
      <Look />
      <Orbit />
      <div className={v.content}>
        <header className={s.hero} data-orbit="27 -10 0.7 0 1" data-orbit-m="22 -26 0.55 0 0.9">
          <span className={`mono ${v.eyebrow}`} style={{ ['--d' as string]: '200ms' }} data-hero>(01) Работы</span>
          <h1 className={s.h1} aria-label={`Работы, ${PROJECTS.length} проектов`}>
            <span aria-hidden="true"><Letters text="Работы" /></span>
            <sup className={s.count} aria-hidden="true">({pad(PROJECTS.length)})</sup>
          </h1>
          <p className={s.lead} style={{ ['--d' as string]: '700ms' }} data-hero>Сайты, интерфейсы и редизайны. В каждом кейсе — задача, решение и цифры после запуска.</p>
        </header>

        {/* Bar + list share one wrapper so the sticky filter capsule stops where the cases end. */}
        <div className={s.works} data-orbit="30 4 0.95 22 0.4" data-orbit-m="20 0 0.8 18 0.3">
        <div className={s.barWrap}>
          <div className={`${v.glass} ${s.bar}`}>
            <div className={s.filters} role="group" aria-label="Фильтр по категории">
              {FILTERS.map((x) => <Chip key={x} size="md" active={f === x} onClick={() => setF(x)}>{x}</Chip>)}
            </div>
            <div className={s.views} role="group" aria-label="Вид">
              <Chip size="md" active={view === 'grid'} onClick={() => setView('grid')}>Сетка</Chip>
              <Chip size="md" active={view === 'list'} onClick={() => setView('list')}>Список</Chip>
            </div>
          </div>
        </div>

        <div className={s.list}>
          {list.length === 0 && <p className={s.empty}>В этой категории пока нет проектов — выберите другую.</p>}
          {view === 'list' && !mobile ? (
            <div className={`${v.glass} ${s.rows}`}>
              <div className={`mono ${s.rowHead}`}><span>Проект</span><span>Услуги</span><span>Категория</span><span>Результат</span><span>Год</span></div>
              {list.map((p) => <ListRow key={p.slug} p={p} />)}
            </div>
          ) : (
            <div className={s.grid}>
              {list.map((p, i) => {
                const [span] = PATTERN[i % PATTERN.length];
                return (
                  <div key={p.slug} className={span === 8 ? s.span8 : s.span4}>
                    <WorkCard p={p} ratio={mobile ? '4/5' : undefined} i={i} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        </div>

        <ContactV7 eyebrow="(02) Контакт" />
        <FooterV7 />
      </div>
    </div>
  );
}
