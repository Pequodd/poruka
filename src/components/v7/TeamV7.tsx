import { TEAM } from '@/data/content';
import { TeamCard } from '../ui/TeamCard';
import s from './V7.module.css';

/** Team in the v7 system: shared section head, portraits revealed from blur, a glass note on direct contact. */
export function TeamV7() {
  return (
    <section id="team" className={s.team} data-orbit="0 0 1.3 22 0.5" data-orbit-m="0 0 1.1 18 0.4">
      <div className={s.secHead}>
        <span className={`mono ${s.eyebrow}`} data-rv>(06) Команда</span>
        <h2 className={s.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Люди, которые ставят подпись</h2>
        <p className={s.secLead} data-rv style={{ ['--d' as string]: '160ms' }}>Без менеджеров‑посредников. Вы общаетесь напрямую с теми, кто делает проект.</p>
      </div>
      <div className={s.teamGrid}>
        {TEAM.map((m, i) => (
          <div key={m.role} data-rv style={{ ['--d' as string]: `${i * 90}ms` }}><TeamCard {...m} /></div>
        ))}
      </div>
    </section>
  );
}
