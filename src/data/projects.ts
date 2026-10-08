/**
 * Project data lives in projects.json — the /admin/ page edits that file through the GitHub API
 * and every publish rebuilds the site. This module only types it and adds helpers.
 * Screenshot paths may be empty → frames show placeholders. Uploaded files go to /assets/cases/<slug>/.
 */
import data from './projects.json';

export const CATEGORIES = ['Сайты', 'UI/UX', 'WordPress', 'Битрикс', 'Редизайн', 'AI'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface CaseStat { value: string; suffix?: string; caption: string }

export const SCREEN_TYPES = ['scroll', 'pair', 'strip', 'detail', 'beforeAfter'] as const;

export interface Screen {
  type: (typeof SCREEN_TYPES)[number];
  /** «Главная» → caption «01 — Главная» */
  label: string;
  /** One phrase, right side of the caption */
  note?: string;
  /** scroll / pair / detail */
  desktop?: string;
  /** scroll & pair: string; strip: string[] */
  mobile?: string | string[];
  /** strip: caption per phone */
  labels?: string[];
  before?: string;
  after?: string;
  /** detail: offset in % of the image */
  crop?: { x: number; y: number };
  /** detail: 2–3 lines «почему так» */
  why?: string;
}

export interface CaseStudy {
  oneLiner: string;
  client: string;
  duration: string;
  stack: string[];
  tags: string[];
  url: string;
  task: [string, string];
  screens: Screen[];
  colors: string[];
  font: string;
  decision: string;
  stats: CaseStat[];
  quote: [string, string];
  author: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Path inside /public, or undefined → flat placeholder slot. */
  image?: string;
  meta: string;
  cat: Category;
  result: string;
  services: string;
  year: string;
  case: CaseStudy;
}

export const PROJECTS = data as unknown as Project[];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const caseHref = (p: Project) => `/cases/${p.slug}/`;
export const FILTERS = ['Все', ...CATEGORIES] as const;
