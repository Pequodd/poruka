'use client';
import { useState } from 'react';
import { Button } from './Button';
import { ChipGroup } from './ChipGroup';
import { TextField } from './TextField';
import s from './ContactForm.module.css';

export type FormData = { name: string; contact: string; company: string; about: string; need: string[]; budget: string[] };

const NEEDS = ['Сайт', 'Дизайн', 'Редизайн', 'Битрикс', 'WordPress', 'Поддержка', 'AI'];
const BUDGETS = ['до 300 тыс.', '300–700 тыс.', '700 тыс.+', 'Не знаю'];
const ERR = 'Укажите телефон или Telegram';

/** Contact form. Success replaces the form with the «ПРИНЯТО» stamp. Hook `onSubmit` to a backend / CMS later. */
export function ContactForm({ onSubmit }: { onSubmit?: (d: FormData) => void }) {
  const [d, setD] = useState<FormData>({ name: '', contact: '', company: '', about: '', need: [], budget: [] });
  const [err, setErr] = useState<string | undefined>();
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);
  const u = <K extends keyof FormData>(k: K) => (v: FormData[K]) => setD((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.contact.trim()) { setErr(ERR); return; }
    setErr(undefined);
    setSending(true);
    onSubmit?.(d);
    // No backend yet: short «sending» state so the click visibly does something, then the stamp.
    setTimeout(() => { setSending(false); setOk(true); }, 600);
  };

  if (ok)
    return (
      <div className={s.done} role="status">
        <span className={s.stamp}>ПРИНЯТО</span>
        <p className={s.doneText}><b>Заявка у нас.</b> Ответим в течение дня.</p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className={s.form}>
      <div className={s.fields}>
        <TextField label="Имя" name="name" autoComplete="name" placeholder="Как к вам обращаться" value={d.name} onChange={u('name')} />
        <TextField label="Телефон или Telegram" name="contact" required autoComplete="tel" placeholder="Номер или @username" value={d.contact} onChange={(v) => { u('contact')(v); setErr(undefined); }} error={err} />
        <TextField label="Компания" name="company" autoComplete="organization" placeholder="Название или сайт" value={d.company} onChange={u('company')} />
      </div>
      <ChipGroup label="Что нужно" options={NEEDS} value={d.need} onChange={u('need')} />
      <ChipGroup label="Бюджет" options={BUDGETS} value={d.budget} onChange={u('budget')} multi={false} />
      <TextField label="О проекте" name="about" multiline placeholder="Что есть сейчас, что нужно и к какому сроку" value={d.about} onChange={u('about')} />
      <div className={s.submit}>
        <Button type="submit" disabled={sending}>{sending ? 'Отправляем…' : 'Отправить заявку'}</Button>
        <span className={s.consent}>Нажимая кнопку, вы соглашаетесь на обработку персональных данных</span>
      </div>
    </form>
  );
}
