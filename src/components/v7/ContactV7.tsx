import { CONTACTS } from '@/data/content';
import { ContactForm } from '../ui/ContactForm';
import s from './V7.module.css';

/** Contact in the v7 system: shared section head; a glass card with direct contacts next to the form on glass. */
export function ContactV7({ eyebrow = '(09) Контакт' }: { eyebrow?: string }) {
  return (
    <section id="contact" className={s.contactV7} data-orbit="-30 10 0.9 8 0" data-orbit-m="0 -30 0.6 8 0">
      <div className={s.secHead}>
        <span className={`mono ${s.eyebrow}`} data-rv>{eyebrow}</span>
        <h2 className={s.h2} data-rv style={{ ['--d' as string]: '80ms' }}>Расскажите о задаче</h2>
      </div>
      <div className={s.cGrid}>
        <aside className={`${s.glass} ${s.cAside}`} data-rv>
          <span className={`mono ${s.ctaNote}`}><span className={s.liveDot} aria-hidden="true" />На связи · ответ за день</span>
          <p className={s.cText}><b>Пишите напрямую</b> — тем, кто делает проект. Если задача не наша, честно скажем.</p>
          <a className={s.ctaInk} href={CONTACTS.telegramUrl} target="_blank" rel="noreferrer">Написать в Telegram</a>
          <div className={s.cDirect}>
            <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
            <a href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
          </div>
        </aside>
        <div className={`${s.glass} ${s.cForm}`} data-rv style={{ ['--d' as string]: '120ms' }}><ContactForm /></div>
      </div>
    </section>
  );
}
