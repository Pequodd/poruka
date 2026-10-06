import { CONTACTS } from '@/data/content';
import { Button } from '../ui/Button';
import { ContactForm } from '../ui/ContactForm';
import { SectionMarker } from '../ui/SectionMarker';
import s from './Home.module.css';

/** Contact: heading across cols 5–12; sticky direct-contact column on the left, wide form on the right. */
export function Contact() {
  return (
    <section id="contact" className={s.contact}>
      <div className="container">
        <div className={s.contactGrid}>
          <div className={s.contactMarker}><SectionMarker>Контакт</SectionMarker></div>
          <h2 className={s.contactHead}>Расскажите<br />о задаче</h2>
          <aside className={s.contactAside}>
            <span className={`mono ${s.live}`}><span className={s.liveDot} aria-hidden="true" />На связи · ответ за день</span>
            <p className={s.bodyL}><b>Пишите напрямую</b> — тем, кто делает проект. Если нам не подходит задача, честно скажем.</p>
            <Button variant="secondary" href={CONTACTS.telegramUrl} className={s.full}>Написать в Telegram</Button>
            <div className={s.direct}>
              <a href={`mailto:${CONTACTS.email}`} className="mono">{CONTACTS.email}</a>
              <a href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`} className="mono">{CONTACTS.phone}</a>
            </div>
          </aside>
          <div className={s.contactForm}><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}
