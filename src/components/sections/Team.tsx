import { TEAM } from '@/data/content';
import { TeamCard } from '../ui/TeamCard';
import { H2, Lead, Section } from './Section';
import s from './Home.module.css';

export function Team() {
  return (
    <div id="team">
      <Section marker="Команда">
        <H2>Люди, которые<br /><span className="secondary">ставят свою подпись</span></H2>
      </Section>
      <section className={s.teamSection}>
        <div className="container">
          <div className={s.team}>{TEAM.map((m) => <TeamCard key={m.role} {...m} />)}</div>
          <div className={s.teamLead}><Lead parts={['Без менеджеров‑посредников.', ' Вы общаетесь напрямую с теми, кто делает проект.']} /></div>
        </div>
      </section>
    </div>
  );
}
