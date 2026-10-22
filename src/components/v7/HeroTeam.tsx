'use client';
import Link from 'next/link';
import { TEAM } from '@/data/content';
import { asset } from '@/lib/asset';
import { Letters } from './Letters';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

type Member = { name: string; role: string; image?: string; objectPosition?: string };

/**
 * Hero, variant 4 «Команда»: the hybrid-team idea made visible. Title and CTAs on top; the four people as B&W
 * portrait cards that fan out on load (hover straightens a card and shows the name), and a fifth dashed card —
 * «+ ваша команда» — the place the studio joins.
 */
export function HeroTeam() {
  const team = (TEAM as Member[]).filter((m) => m.image);
  return (
    <section className={s.teamHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.teamTop}>
        <h1 className={s.teamTitle} aria-label="Дизайн и разработка сайтов">
          <span aria-hidden="true"><Letters text="Дизайн и разработка" from={0} /></span>
          <span aria-hidden="true"><Letters text="сайтов" from={18} tail={<span className={`${v.ltr} ${v.seal}`} style={{ ['--i' as string]: 24 }}>.</span>} /></span>
        </h1>
        <div className={s.teamSide}>
          <p className={s.teamLead} style={{ ['--d' as string]: '900ms' }} data-hero>Гибридная команда: встраиваемся в ваш коллектив на время проекта — дизайн, разработка, запуск и поддержка.</p>
          <div className={v.heroBtns} style={{ ['--d' as string]: '1050ms' }} data-hero>
            <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
            <Link className={v.ctaInk} href="/portfolio/">Смотреть кейсы</Link>
          </div>
        </div>
      </div>

      <ul className={s.fan} aria-label="Команда">
        {team.map((m, i) => (
          <li key={m.name} className={s.fanCard} style={{ ['--k' as string]: i, ['--n' as string]: team.length + 1 }}>
            <img src={asset(m.image!)} alt={`${m.name}, ${m.role}`} style={{ objectPosition: m.objectPosition }} />
            <span className={s.fanPlate}><b>{m.name}</b><span className="mono">{m.role}</span></span>
          </li>
        ))}
        <li className={`${s.fanCard} ${s.fanYou}`} style={{ ['--k' as string]: team.length, ['--n' as string]: team.length + 1 }}>
          <a href="#contact" className={s.fanYouIn}>
            <span className={s.fanPlus} aria-hidden="true">+</span>
            <b>Ваша команда</b>
            <span>Встраиваемся на время проекта</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
