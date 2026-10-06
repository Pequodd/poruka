import Link from 'next/link';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import s from './V7.module.css';

const ITEMS = PROJECTS.filter((p) => p.image).slice(0, 3);

/** Client stories over the glass seal, now far out of focus: image + task on one side, giant title on the other. */
export function StoriesV7() {
  return (
    <section className={s.stories} data-orbit="12 0 1.5 26 0.6" data-orbit-m="0 0 1.3 20 0.5">
      <div className={s.secHead}>
        <span className={`mono ${s.eyebrow}`} data-rv>(04) Истории</span>
        <h2 className={s.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Что изменилось у клиентов</h2>
      </div>
      {ITEMS.map((p, i) => {
        const st = p.case.stats[0];
        return (
          <article key={p.slug} className={`${s.story} ${i % 2 ? s.storyFlip : ''}`}>
            <div className={s.storyMedia}>
              <Link href={caseHref(p)} className={s.storyImg} data-rv>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(p.image!)} alt={`${p.title} — сайт`} loading="lazy" />
              </Link>
              <p className={s.storyTask} data-rv style={{ ['--d' as string]: '120ms' }}>{p.case.task.join('')}</p>
            </div>
            <div className={s.storyText}>
              <span className={`mono ${s.eyebrow}`} data-rv>{p.meta}</span>
              <h3 className={s.storyTitle} data-rv style={{ ['--d' as string]: '80ms' }}>{p.case.oneLiner}</h3>
              <div className={s.storyStats} data-rv style={{ ['--d' as string]: '160ms' }}>
                {p.case.stats.map((x) => (
                  <div key={x.caption} className={`${s.glass} ${s.statChip}`}><b>{x.value}{x.suffix}</b><span className="mono">{x.caption}</span></div>
                ))}
              </div>
              <blockquote className={s.quote} data-rv style={{ ['--d' as string]: '240ms' }}>
                {p.case.quote.join('')}
                <cite className="mono">{p.case.author}</cite>
              </blockquote>
              <Link href={caseHref(p)} className={s.wLink} data-rv style={{ ['--d' as string]: '300ms' }}>Читать кейс «{p.title}» →</Link>
              <span className={s.srOnly}>{st.value}{st.suffix} {st.caption}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
