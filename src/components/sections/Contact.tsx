import { CONTACTS } from '@/data/content';
import { Button } from '../ui/Button';
import { ContactForm } from '../ui/ContactForm';
import { SectionMarker } from '../ui/SectionMarker';
import s from './Home.module.css';

export function Contact() {
  return (
    <section id="contact" className={s.contact}>
      <div className="container">
        <div className={s.contactGrid}>
          <div className={s.contactMarker}><SectionMarker>Контакт</SectionMarker></div>
          <div className={s.contactText}>
            <h2 className={s.h1}>Расскажите<br />о задаче</h2>
            <p className={s.bodyL}>Ответим в течение дня. Если нам не подходит проект — честно скажем.</p>
            <Button variant="secondary" href={CONTACTS.telegramUrl} className={s.full}>Написать в Telegram</Button>
            <a href={`mailto:${CONTACTS.email}`} className={`mono ${s.mail}`}>{CONTACTS.email}</a>
          </div>
          <div className={s.contactForm}><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}
