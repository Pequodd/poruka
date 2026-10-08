import type { Metadata } from 'next';
import { Case } from '@/components/pages/Case';
import { PROJECTS, type Project } from '@/data/projects';

// Demo of the new case blocks on a copy of the first case; case covers stand in for screenshots. Real cases are untouched.
export const metadata: Metadata = { title: 'ПОРУКА — новые блоки кейса', robots: { index: false, follow: false } };

const base = PROJECTS[0];
const covers = PROJECTS.map((p) => p.image).filter(Boolean) as string[];
const demo: Project = {
  ...base,
  slug: `${base.slug}-demo`,
  case: {
    ...base.case,
    screens: [
      { type: 'wide', label: 'Крупный экран в браузере', note: 'Один скриншот на всю ширину — растёт при прокрутке', desktop: covers[0] },
      { type: 'text', label: 'Главный вопрос покупателя — подойдёт ли деталь. Поэтому совместимость стоит выше цены.', note: 'Текстовая вставка', why: 'Абзац под фразой: 2–3 предложения о решении, которое видно на следующем экране.' },
      { type: 'stage', label: 'Крупный экран на цветном фоне', note: 'Фон — первый цвет клиента, экран выпрямляется при прокрутке', desktop: covers[1] || covers[0] },
      { type: 'grid', label: 'Сетка из трёх экранов', note: 'Один большой и два малых', images: covers.slice(0, 3) },
      ...base.case.screens,
    ],
  },
};

export default function Page() {
  return <Case project={demo} />;
}
