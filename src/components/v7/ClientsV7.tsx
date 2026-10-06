import { PROJECTS } from '@/data/projects';
import s from './V7.module.css';

/** Client wordmarks on glass plates, drifting over the blurred glass seal. Pauses on hover; static with reduced motion. */
export function ClientsV7() {
  const row = PROJECTS.map((p) => ({ name: p.case.client.replace(/ \(NDA\)/, ''), color: p.case.colors[1], slug: p.slug }));
  return (
    <section className={s.clients} data-orbit="0 0 1.25 16 0.75" data-orbit-m="0 0 1.1 14 0.6" aria-label="Клиенты">
      <span className={`mono ${s.eyebrow} ${s.clientsHead}`} data-rv>(05) Нам доверяют</span>
      <div className={s.marq}>
        <ul className={s.track}>
          {[0, 1].map((k) => row.map((c) => (
            <li key={`${k}-${c.slug}`} className={`${s.glass} ${s.logo}`} aria-hidden={k === 1}>
              <span className={s.logoMark} style={{ background: c.color }} />
              <span>{c.name}</span>
            </li>
          )))}
        </ul>
      </div>
    </section>
  );
}
