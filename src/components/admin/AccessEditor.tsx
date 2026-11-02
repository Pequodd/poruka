'use client';
import { useState } from 'react';
import { encryptToken, normLogin, type AccessEntry } from './github';
import s from './Admin.module.css';

const MIN = 12;

/**
 * Logins of the admin. Each one keeps the current GitHub token encrypted with its own password,
 * so people sign in with login + password and never see the token. Saved with «Опубликовать».
 */
export function AccessEditor({ users, token, me, onChange }: {
  users: AccessEntry[];
  token: string;
  me: string;
  onChange: (next: AccessEntry[]) => void;
}) {
  const [login, setLogin] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const l = normLogin(login);
  const exists = users.some((u) => u.login === l);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = !/^[a-z0-9._-]{2,32}$/.test(l) ? 'Логин: 2–32 символа, латиница, цифры, точка, дефис или подчёркивание'
      : pw.length < MIN ? `Пароль — не короче ${MIN} символов`
      : pw !== pw2 ? 'Пароли не совпадают' : '';
    if (problem) { setErr(problem); return; }
    setBusy(true); setErr('');
    try {
      const entry = await encryptToken(l, pw, token);
      onChange(exists ? users.map((u) => (u.login === l ? entry : u)) : [...users, entry]);
      setLogin(''); setPw(''); setPw2('');
    } catch (x) { setErr(x instanceof Error ? x.message : String(x)); }
    setBusy(false);
  };

  return (
    <div className={s.editor}>
      <section className={s.section}>
        <header className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Кто может входить</h2>
          <p className={s.sectionNote}>Вход по логину и паролю. Пароли нигде не хранятся: под каждым паролем зашифрован токен GitHub, с которым вы сейчас вошли. Изменения вступают в силу после «Опубликовать».</p>
        </header>
        {users.length ? (
          <ul className={s.cats}>
            {users.map((u) => (
              <li key={u.login} className={s.accRow}>
                <b>{u.login}</b>
                <span className={s.catCount}>{u.login === me ? 'это вы' : ''}</span>
                <button type="button" className={`${s.btnSm} ${s.btnDanger}`}
                  onClick={() => confirm(`Удалить вход «${u.login}»?${u.login === me ? ' Это ваш логин — дальше входите по токену или другим логином.' : ''}`) && onChange(users.filter((x) => x.login !== u.login))}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        ) : <p className={s.hint}>Пока никого. Добавьте первый логин — и дальше токен не понадобится.</p>}

        <form className={s.accForm} onSubmit={add} noValidate>
          <div className={s.field}>
            <label htmlFor="acc-login" className={s.label}>Логин</label>
            <input id="acc-login" className={s.input} autoComplete="off" value={login} onChange={(e) => { setLogin(e.target.value); setErr(''); }} placeholder="например, daria" />
          </div>
          <div className={s.field}>
            <label htmlFor="acc-pw" className={s.label}>Пароль</label>
            <input id="acc-pw" className={s.input} type="password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} placeholder={`от ${MIN} символов`} />
          </div>
          <div className={s.field}>
            <label htmlFor="acc-pw2" className={s.label}>Ещё раз</label>
            <input id="acc-pw2" className={s.input} type="password" autoComplete="new-password" value={pw2} onChange={(e) => { setPw2(e.target.value); setErr(''); }} />
          </div>
          <button className={s.btnPrimary} disabled={!login.trim() || !pw || busy}>{busy ? 'Шифруем…' : exists ? 'Сменить пароль' : 'Добавить'}</button>
        </form>
        {err && <p className={s.error} role="alert">{err}</p>}
        <p className={s.hint}>Список логинов лежит на сайте в открытом виде (токен — только зашифрованным), поэтому пароль нужен длинный и нигде больше не используемый. Если токен перевыпустили — войдите с новым и пересоздайте логины.</p>
      </section>
    </div>
  );
}
