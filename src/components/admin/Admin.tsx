'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Project } from '@/data/projects';
import { asset, BASE } from '@/lib/asset';
import { CaseEditor, emptyProject, type Errors } from './CaseEditor';
import { ImagesCtx, move } from './fields';
import { CategoryEditor } from './CategoryEditor';
import { ACTIONS_URL, CATS_PATH, checkAccess, DATA_PATH, deployState, explain, loadData, publish, TOKEN_URL, type DeployState, type Remote } from './github';
import { kb, prepareImage } from './images';
import s from './Admin.module.css';

const TOKEN_KEY = 'poruka-admin-token';
export const PREVIEW_KEY = 'poruka-admin-preview';
const store = {
  get: (k: string) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
  set: (k: string, v: string) => { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* private mode: token lives for this tab only */ } },
};

interface Item { id: string; p: Project; isNew: boolean }
interface Pending { blob: Blob; url: string }
let seq = 0;
const wrap = (p: Project, isNew = false): Item => ({ id: `c${++seq}`, p, isNew });
/** Sidebar «view id» of the category editor (case ids are c1, c2…). */
const CATS = 'categories';

/** Every /assets/… path a set of projects points to. */
function referenced(projects: Project[]) {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') { if (v.startsWith('/assets/')) out.add(v); }
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(projects);
  return out;
}

function validate(items: Item[]) {
  const errs: Record<string, Errors> = {};
  const seen = new Map<string, number>();
  items.forEach((it) => seen.set(it.p.slug, (seen.get(it.p.slug) || 0) + 1));
  for (const it of items) {
    const e: Errors = {};
    if (!it.p.title.trim()) e.title = 'Укажите название';
    if (!it.p.slug) e.slug = 'Укажите адрес';
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.p.slug)) e.slug = 'Только латиница, цифры и дефис между словами';
    else if ((seen.get(it.p.slug) || 0) > 1) e.slug = 'Такой адрес уже есть у другого кейса';
    if (e.title || e.slug) errs[it.id] = e;
  }
  return errs;
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [t, setT] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await checkAccess(t.trim()); onToken(t.trim()); } catch (x) { setErr(explain(x)); }
    setBusy(false);
  };
  return (
    <div className={s.loginWrap}>
      <form className={s.login} onSubmit={submit}>
        <span className={`mono ${s.eyebrow}`}>Порука · админка</span>
        <h1 className={s.loginTitle}>Кейсы</h1>
        <p className={s.loginLead}>Вход по токену GitHub. Изменения сохраняются в репозиторий, а сайт пересобирается сам за 2–3 минуты.</p>
        <ol className={s.steps}>
          <li>Откройте <a href={TOKEN_URL} target="_blank" rel="noreferrer">создание токена</a> (Fine‑grained).</li>
          <li>Repository access → Only select repositories → <b>Pequodd/poruka</b>.</li>
          <li>Permissions → Contents: <b>Read and write</b>. По желанию Actions: Read — чтобы видеть статус сборки.</li>
          <li>Скопируйте токен и вставьте сюда.</li>
        </ol>
        <label htmlFor="tok" className={s.label}>Токен</label>
        <input id="tok" className={`${s.input} ${s.monoInput}`} type="password" autoComplete="off" value={t} onChange={(e) => setT(e.target.value)} placeholder="github_pat_…" aria-invalid={!!err} />
        {err && <p className={s.error} role="alert">{err}</p>}
        <button className={s.btnPrimary} disabled={!t.trim() || busy}>{busy ? 'Проверяем…' : 'Войти'}</button>
        <p className={s.hint}>Токен хранится только в этом браузере.</p>
      </form>
    </div>
  );
}

export function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [remote, setRemote] = useState<Remote | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [sel, setSel] = useState('');
  const [loadErr, setLoadErr] = useState('');
  const [compress, setCompress] = useState(true);
  const pending = useRef(new Map<string, Pending>());
  const [, bump] = useState(0);
  const [pub, setPub] = useState<{ step?: string; error?: string; sha?: string; deploy?: DeployState } | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => setToken(store.get(TOKEN_KEY)), []);

  const load = useCallback(async (t: string) => {
    setLoadErr('');
    try {
      const r = await loadData(t);
      setRemote(r);
      setCats(r.categories);
      const next = r.projects.map((p) => wrap(p));
      setItems(next);
      setSel((cur) => cur === CATS ? cur : next.find((x) => x.p.slug === items.find((i) => i.id === cur)?.p.slug)?.id || next[0]?.id || '');
    } catch (e) { setLoadErr(explain(e)); }
  }, [items]);

  useEffect(() => { if (token) load(token); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const draft = useMemo(() => items.map((i) => i.p), [items]);
  const allErrors = useMemo(() => validate(items), [items]);
  // «Fill this in» errors wait for a publish attempt; format and duplicate errors show right away.
  const [tried, setTried] = useState(false);
  const errors = useMemo(() => {
    if (tried) return allErrors;
    const out: Record<string, Errors> = {};
    for (const [id, e] of Object.entries(allErrors)) {
      const soft = Object.fromEntries(Object.entries(e).filter(([, m]) => !m.startsWith('Укажите')));
      if (Object.keys(soft).length) out[id] = soft;
    }
    return out;
  }, [allErrors, tried]);
  const remoteBySlug = useMemo(() => new Map((remote?.projects || []).map((p) => [p.slug, JSON.stringify(p)])), [remote]);
  const status = (it: Item) => (it.isNew || !remoteBySlug.has(it.p.slug) ? 'new' : remoteBySlug.get(it.p.slug) !== JSON.stringify(it.p) ? 'edited' : '');
  const removed = useMemo(() => (remote?.projects || []).filter((p) => !draft.some((d) => d.slug === p.slug)), [remote, draft]);
  const catsDirty = !!remote && JSON.stringify(cats) !== JSON.stringify(remote.categories);
  const dirty = !!remote && (catsDirty || JSON.stringify(draft) !== JSON.stringify(remote.projects));
  const changes = items.filter((i) => status(i)).length + removed.length + (catsDirty ? 1 : 0);
  const orderChanged = dirty && changes === 0;
  const usage = useMemo(() => draft.reduce<Record<string, number>>((m, p) => ({ ...m, [p.cat]: (m[p.cat] || 0) + 1 }), {}), [draft]);
  const changeCats = (next: string[], renamed?: { from: string; to: string }, moved?: { name: string; to: string }) => {
    setCats(next);
    const from = renamed?.from ?? moved?.name, to = renamed?.to ?? moved?.to;
    if (from !== undefined && to !== undefined) setItems((xs) => xs.map((x) => (x.p.cat === from ? { ...x, p: { ...x.p, cat: to } } : x)));
  };

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    addEventListener('beforeunload', h);
    return () => removeEventListener('beforeunload', h);
  }, [dirty]);

  const current = items.find((i) => i.id === sel);
  const setCurrent = (p: Project) => setItems((xs) => xs.map((x) => (x.id === sel ? { ...x, p } : x)));

  // Live preview in another tab: the draft of the open case + local URLs of not-yet-published images.
  const previewWin = useRef<Window | null>(null);
  const pushPreview = useCallback(() => {
    if (!current) return;
    const overrides = Object.fromEntries([...pending.current].map(([k, v]) => [k, v.url]));
    store.set(PREVIEW_KEY, JSON.stringify({ project: current.p, overrides, t: Date.now() }));
  }, [current]);
  useEffect(() => {
    if (!previewWin.current || previewWin.current.closed) return;
    const t = setTimeout(pushPreview, 250);
    return () => clearTimeout(t);
  }, [pushPreview]);
  const openPreview = () => {
    pushPreview();
    previewWin.current = window.open(`${BASE}/admin/preview/`, 'poruka-preview');
  };

  const images = useMemo(() => ({
    src: (path: string) => pending.current.get(path)?.url || asset(path),
    upload: async (file: File) => {
      const { path, blob } = await prepareImage(file, current?.p.slug || 'new', compress);
      pending.current.set(path, { blob, url: URL.createObjectURL(blob) });
      bump((n) => n + 1);
      return path;
    },
  }), [current?.p.slug, compress]);

  const addCase = () => {
    const it = wrap({ ...emptyProject(), cat: cats[0] || '' }, true);
    setItems((xs) => [it, ...xs]);
    setSel(it.id);
  };
  const removeCase = (it: Item) => {
    if (!confirm(`Удалить кейс «${it.p.title || 'без названия'}»? Он исчезнет с сайта после публикации.`)) return;
    setItems((xs) => {
      const rest = xs.filter((x) => x.id !== it.id);
      if (sel === it.id) setSel(rest[0]?.id || '');
      return rest;
    });
  };
  const discard = () => {
    if (!remote || !confirm('Отменить все неопубликованные изменения?')) return;
    const next = remote.projects.map((p) => wrap(p));
    setItems(next); setCats(remote.categories); setSel(next[0]?.id || '');
  };

  const doPublish = async () => {
    if (!token || !remote) return;
    setTried(true);
    const bad = items.find((i) => allErrors[i.id]);
    if (bad) { setSel(bad.id); setPub({ error: `Проверьте поля в кейсе «${bad.p.title || 'без названия'}».` }); return; }
    const refs = referenced(draft);
    const uploads = [...pending.current].filter(([path]) => refs.has(path)).map(([path, v]) => ({ path, blob: v.blob }));
    const names = (xs: string[]) => xs.filter(Boolean).join(', ');
    const added = items.filter((i) => status(i) === 'new').map((i) => i.p.title);
    const edited = items.filter((i) => status(i) === 'edited').map((i) => i.p.title);
    const message = ['Кейсы: правки из админки', '',
      added.length ? `Добавлены: ${names(added)}` : '', edited.length ? `Изменены: ${names(edited)}` : '',
      removed.length ? `Удалены: ${names(removed.map((p) => p.title))}` : '', catsDirty ? `Категории: ${cats.join(', ')}` : '', orderChanged ? 'Изменён порядок' : ''].filter((l, i) => i < 2 || l).join('\n');
    try {
      const r = await publish(token, { files: { [DATA_PATH]: draft, [CATS_PATH]: cats }, baseShas: remote.shas, uploads, removedSlugs: removed.map((p) => p.slug), keepPaths: refs, message, onStep: (step) => setPub({ step }) });
      setRemote({ projects: JSON.parse(JSON.stringify(draft)), categories: [...cats], shas: r.shas });
      setItems((xs) => xs.map((x) => ({ ...x, isNew: false })));
      setPub({ sha: r.commit, deploy: 'queued' });
    } catch (e) {
      setPub({ error: explain(e) });
    }
  };

  // Follow the deploy of the published commit.
  useEffect(() => {
    const sha = pub?.sha;
    if (!token || !sha || !(pub.deploy === 'queued' || pub.deploy === 'building')) return;
    let live = true;
    const t = setTimeout(async () => {
      const d = await deployState(token, sha);
      if (live) setPub((p) => (p?.sha === sha ? { ...p, deploy: d } : p));
    }, 8000);
    return () => { live = false; clearTimeout(t); };
  }, [pub, token]);

  const logout = () => {
    if (dirty && !confirm('Есть неопубликованные изменения. Выйти и потерять их?')) return;
    store.set(TOKEN_KEY, ''); setToken(''); setRemote(null); setItems([]); setCats([]);
  };

  if (token === null) return null;
  if (!token) return <Login onToken={(t) => { store.set(TOKEN_KEY, t); setToken(t); }} />;
  if (!remote) {
    return (
      <div className={s.loginWrap}>
        <div className={s.login}>
          {loadErr ? <><p className={s.error} role="alert">{loadErr}</p><div className={s.addRow}><button className={s.btnPrimary} onClick={() => load(token)}>Повторить</button><button className={`${s.btnSm} ${s.btnGhost}`} onClick={logout}>Сменить токен</button></div></> : <p className={s.hint}>Загружаем кейсы…</p>}
        </div>
      </div>
    );
  }

  const visible = items.filter((i) => !query || `${i.p.title} ${i.p.slug} ${i.p.cat}`.toLowerCase().includes(query.toLowerCase()));
  const pendingSize = [...pending.current].filter(([p]) => referenced(draft).has(p)).reduce((n, [, v]) => n + v.blob.size, 0);

  return (
    <ImagesCtx.Provider value={images}>
      <div className={s.app}>
        <header className={s.top}>
          <a className={s.brand} href={`${BASE}/`}>Порука<span className={s.dot} aria-hidden="true" /></a>
          <span className={`mono ${s.eyebrow}`}>Кейсы · {items.length}</span>
          <div className={s.topStatus} role="status">
            {pub?.step ? <span>{pub.step}</span>
              : dirty ? <span className={s.unsaved}>Не опубликовано: {changes || 1} {orderChanged ? '(порядок)' : ''}{pendingSize ? ` · ${kb(pendingSize)} картинок` : ''}</span>
              : pub?.deploy === 'done' ? <span className={s.ok}>Опубликовано, сайт обновлён</span>
              : pub?.deploy === 'failed' ? <span className={s.error}>Сборка сайта упала — <a href={ACTIONS_URL} target="_blank" rel="noreferrer">подробности</a></span>
              : pub?.deploy === 'queued' || pub?.deploy === 'building' ? <span>Опубликовано, сайт пересобирается… (2–3 мин)</span>
              : pub?.deploy === 'unknown' ? <span>Опубликовано. Сайт обновится через 2–3 минуты — <a href={ACTIONS_URL} target="_blank" rel="noreferrer">статус сборки</a></span>
              : <span className={s.muted}>Все изменения опубликованы</span>}
          </div>
          <div className={s.topActions}>
            {dirty && <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={discard} disabled={!!pub?.step}>Отменить</button>}
            <button type="button" className={s.btnPrimary} onClick={doPublish} disabled={!dirty || !!pub?.step}>{pub?.step ? 'Публикуем…' : 'Опубликовать'}</button>
            <button type="button" className={`${s.btnSm} ${s.btnGhost}`} onClick={logout}>Выйти</button>
          </div>
        </header>
        {pub?.error && <div className={s.banner} role="alert">{pub.error}<button type="button" className={s.iconBtn} onClick={() => setPub(null)} aria-label="Закрыть">×</button></div>}

        <div className={s.body}>
          <aside className={s.side} aria-label="Список кейсов">
            <button type="button" className={s.btnPrimary} onClick={addCase}>+ Новый кейс</button>
            <input className={s.input} type="search" placeholder="Поиск" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Поиск по кейсам" />
            <ul className={s.list}>
              {visible.map((it) => {
                const i = items.indexOf(it);
                const st = status(it);
                return (
                  <li key={it.id} className={`${s.li} ${it.id === sel ? s.liActive : ''}`}>
                    <button type="button" className={s.liMain} onClick={() => setSel(it.id)} aria-current={it.id === sel}>
                      <span className={s.thumb} style={{ background: it.p.case.colors[0] || 'var(--line-hairline)' }}>
                        {it.p.image && <img src={images.src(it.p.image)} alt="" />}
                      </span>
                      <span className={s.liText}>
                        <b>{it.p.title || 'Без названия'}</b>
                        <span className="mono">{it.p.cat} · {it.p.year}</span>
                      </span>
                      {errors[it.id] ? <span className={`${s.badge} ${s.badgeErr}`}>Ошибка</span> : st && <span className={s.badge}>{st === 'new' ? 'Новый' : 'Изменён'}</span>}
                    </button>
                    {!query && (
                      <span className={s.liOrder}>
                        <button type="button" className={s.iconBtn} disabled={i === 0} onClick={() => setItems((xs) => move(xs, i, i - 1))} aria-label={`${it.p.title}: выше`}>↑</button>
                        <button type="button" className={s.iconBtn} disabled={i === items.length - 1} onClick={() => setItems((xs) => move(xs, i, i + 1))} aria-label={`${it.p.title}: ниже`}>↓</button>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {removed.length > 0 && <p className={s.hint}>Будут удалены: {removed.map((p) => p.title).join(', ')}</p>}
            <button type="button" className={`${s.catLink} ${sel === CATS ? s.liActive : ''}`} onClick={() => setSel(CATS)} aria-current={sel === CATS}>
              <span>Категории</span>
              <span className="mono">{cats.length}{catsDirty ? ' · изменены' : ''}</span>
            </button>
            <label className={s.check}><input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} /> Сжимать картинки в WebP</label>
          </aside>

          <main className={s.main}>
            {sel === CATS ? (
              <>
                <div className={s.mainHead}>
                  <div>
                    <span className={`mono ${s.eyebrow}`}>Фильтры портфолио</span>
                    <h1 className={s.mainTitle}>Категории</h1>
                  </div>
                </div>
                <CategoryEditor categories={cats} usage={usage} onChange={changeCats} />
              </>
            ) : current ? (
              <>
                <div className={s.mainHead}>
                  <div>
                    <span className={`mono ${s.eyebrow}`}>{current.isNew ? 'Новый кейс' : `/cases/${current.p.slug}/`}</span>
                    <h1 className={s.mainTitle}>{current.p.title || 'Без названия'}</h1>
                  </div>
                  <div className={s.addRow}>
                    <button type="button" className={s.btnSm} onClick={openPreview}>Предпросмотр</button>
                    {!current.isNew && remoteBySlug.has(current.p.slug) && <a className={`${s.btnSm} ${s.btnGhost}`} href={`${BASE}/cases/${current.p.slug}/`} target="_blank" rel="noreferrer">На сайте ↗</a>}
                    <button type="button" className={`${s.btnSm} ${s.btnDanger}`} onClick={() => removeCase(current)}>Удалить</button>
                  </div>
                </div>
                <CaseEditor key={current.id} p={current.p} onChange={setCurrent} errors={errors[current.id] || {}} isNew={current.isNew} categories={cats} />
              </>
            ) : (
              <div className={s.emptyMain}><p>Кейсов нет.</p><button type="button" className={s.btnPrimary} onClick={addCase}>+ Новый кейс</button></div>
            )}
          </main>
        </div>
      </div>
    </ImagesCtx.Provider>
  );
}
