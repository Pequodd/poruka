import Link from 'next/link';
import { Letters } from '@/components/v7/Letters';
import { Look } from '@/components/v7/Look';
import v from '@/components/v7/V7.module.css';

/** 404 in the site system: glass look, assembling uppercase title, ultramarine way back. */
export default function NotFound() {
  return (
    <div className={v.page}>
      <Look />
      <section className={v.hero} style={{ justifyContent: 'center' }}>
        <span className={`mono ${v.eyebrow}`} style={{ marginBottom: 24 }}>(404) Страница не найдена</span>
        <h1 className={v.heroTitle} style={{ mixBlendMode: 'normal', color: 'var(--text-primary)' }} aria-label="Такой страницы нет">
          <span className={v.heroL1} aria-hidden="true"><Letters text="Такой страницы" /></span>
          <span className={v.heroL2} aria-hidden="true"><Letters text="нет" from={14} tail={<span className={`${v.ltr} ${v.seal}`} style={{ ['--i' as string]: 17, color: 'var(--accent-seal)' }}>.</span>} /></span>
        </h1>
        <div className={v.heroFoot}>
          <p className={v.heroLead}>Возможно, ссылка устарела. Начните с главной или посмотрите работы.</p>
          <div className={v.heroBtns}>
            <Link className={v.ctaMain} href="/">На главную<span className={v.ctaIcon} aria-hidden="true">↗</span></Link>
            <Link className={v.ctaInk} href="/portfolio/">Смотреть работы</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
