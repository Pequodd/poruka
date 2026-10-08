/**
 * The admin has no server: it talks to the GitHub API straight from the browser with a fine-grained token
 * (Contents: read & write on this repo only). Publishing makes one commit to main — the deploy workflow rebuilds the site.
 */
import type { Project } from '@/data/projects';

export const REPO = { owner: 'Pequodd', name: 'poruka', branch: 'main' };
export const DATA_PATH = 'src/data/projects.json';
export const CATS_PATH = 'src/data/categories.json';
const API = `https://api.github.com/repos/${REPO.owner}/${REPO.name}`;

export class GhError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function gh<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new GhError(r.status, body.message || r.statusText);
  }
  return r.status === 204 ? (undefined as T) : r.json();
}

/** Human-readable reason for a failed call. */
export function explain(e: unknown) {
  if (e instanceof GhError) {
    if (e.status === 401) return 'Токен не подходит или истёк. Создайте новый.';
    if (e.status === 403) return 'У токена нет прав на запись. Нужен доступ Contents: Read and write к репозиторию poruka.';
    if (e.status === 404) return 'Репозиторий не найден: токен не видит Pequodd/poruka.';
    if (e.status === 409 || e.status === 422) return 'Файлы в репозитории изменились, пока вы редактировали. Обновите данные и повторите.';
    return `GitHub ответил ошибкой ${e.status}: ${e.message}`;
  }
  return e instanceof Error ? (e.message === 'Failed to fetch' ? 'Нет связи с GitHub. Проверьте интернет.' : e.message) : String(e);
}

const b64ToUtf8 = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)));

export async function checkAccess(token: string) {
  const repo = await gh<{ permissions?: { push?: boolean } }>(token, '');
  if (!repo.permissions?.push) throw new GhError(403, 'no push');
}

/** A JSON data file at a ref and its blob sha ('' when it doesn't exist yet). */
async function readJson<T>(token: string, path: string, ref: string): Promise<{ value: T | null; sha: string }> {
  try {
    const f = await gh<{ content: string; sha: string }>(token, `/contents/${path}?ref=${ref}`);
    return { value: JSON.parse(b64ToUtf8(f.content)) as T, sha: f.sha };
  } catch (e) {
    if (e instanceof GhError && e.status === 404) return { value: null, sha: '' };
    throw e;
  }
}

export interface Remote { projects: Project[]; categories: string[]; shas: Record<string, string> }

/** Current cases and categories, with the blob shas they were read at (used to detect edits made elsewhere). */
export async function loadData(token: string): Promise<Remote> {
  const [p, c] = await Promise.all([readJson<Project[]>(token, DATA_PATH, REPO.branch), readJson<string[]>(token, CATS_PATH, REPO.branch)]);
  const projects = p.value || [];
  const categories = c.value || [...new Set(projects.map((x) => x.cat))];
  return { projects, categories, shas: { [DATA_PATH]: p.sha, [CATS_PATH]: c.sha } };
}

async function listDir(token: string, dir: string) {
  try {
    return await gh<{ path: string; type: string }[]>(token, `/contents/${dir}?ref=${REPO.branch}`);
  } catch (e) {
    if (e instanceof GhError && e.status === 404) return [];
    throw e;
  }
}

export interface Upload { path: string; blob: Blob }

const blobToB64 = (b: Blob) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = () => rej(r.error);
  r.readAsDataURL(b);
});

/**
 * One commit: data files (projects.json, categories.json) + uploaded images − files of deleted cases (unless still referenced).
 * Refuses if a data file changed on GitHub since it was loaded (`baseShas`).
 */
export async function publish(token: string, opts: { files: Record<string, unknown>; baseShas: Record<string, string>; uploads: Upload[]; removedSlugs: string[]; keepPaths: Set<string>; message: string; onStep?: (s: string) => void }) {
  const step = opts.onStep || (() => {});
  step('Проверяем, что данные не менялись…');
  const ref = await gh<{ object: { sha: string } }>(token, `/git/ref/heads/${REPO.branch}`);
  const head = ref.object.sha;
  for (const path of Object.keys(opts.files)) {
    const current = await readJson(token, path, head);
    if (current.sha !== (opts.baseShas[path] || '')) throw new GhError(409, 'stale');
  }
  const commit = await gh<{ tree: { sha: string } }>(token, `/git/commits/${head}`);

  const tree: { path: string; mode: '100644'; type: 'blob'; sha: string | null }[] = [];
  for (const [i, u] of opts.uploads.entries()) {
    step(`Загружаем изображения: ${i + 1} из ${opts.uploads.length}…`);
    const b = await gh<{ sha: string }>(token, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: await blobToB64(u.blob), encoding: 'base64' }) });
    tree.push({ path: `public${u.path}`, mode: '100644', type: 'blob', sha: b.sha });
  }
  const uploaded = new Set(tree.map((t) => t.path));
  for (const slug of opts.removedSlugs) {
    for (const f of await listDir(token, `public/assets/cases/${slug}`)) {
      if (f.type === 'file' && !uploaded.has(f.path) && !opts.keepPaths.has(f.path.replace(/^public/, ''))) tree.push({ path: f.path, mode: '100644', type: 'blob', sha: null });
    }
  }
  step('Сохраняем кейсы…');
  const shas: Record<string, string> = {};
  for (const [path, value] of Object.entries(opts.files)) {
    const b = await gh<{ sha: string }>(token, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: JSON.stringify(value, null, 2) + '\n', encoding: 'utf-8' }) });
    tree.push({ path, mode: '100644', type: 'blob', sha: b.sha });
    shas[path] = b.sha;
  }

  const newTree = await gh<{ sha: string }>(token, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree }) });
  const newCommit = await gh<{ sha: string }>(token, '/git/commits', { method: 'POST', body: JSON.stringify({ message: opts.message, tree: newTree.sha, parents: [head] }) });
  await gh(token, `/git/refs/heads/${REPO.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit.sha }) });
  return { commit: newCommit.sha, shas };
}

export type DeployState = 'queued' | 'building' | 'done' | 'failed' | 'unknown';

/** State of the deploy run for a commit; 'unknown' when the token can't read Actions. */
export async function deployState(token: string, sha: string): Promise<DeployState> {
  try {
    const r = await gh<{ workflow_runs: { status: string; conclusion: string | null }[] }>(token, `/actions/runs?head_sha=${sha}&per_page=5`);
    const run = r.workflow_runs[0];
    if (!run) return 'queued';
    if (run.status !== 'completed') return run.status === 'in_progress' ? 'building' : 'queued';
    return run.conclusion === 'success' ? 'done' : 'failed';
  } catch {
    return 'unknown';
  }
}

export const ACTIONS_URL = `https://github.com/${REPO.owner}/${REPO.name}/actions`;
export const TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new';
