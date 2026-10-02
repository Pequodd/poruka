import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Case } from '@/components/pages/Case';
import { getProject, PROJECTS } from '@/data/projects';

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.title} — кейс ПОРУКА`, description: p.case.lead } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return <Case project={p} />;
}
