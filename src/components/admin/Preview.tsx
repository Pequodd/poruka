'use client';
import { useEffect, useState } from 'react';
import type { Project } from '@/data/projects';
import { setAssetOverrides } from '@/lib/asset';
import { Case } from '../pages/Case';
import s from './Admin.module.css';

const KEY = 'poruka-admin-preview';

/** Renders the case the admin is editing exactly as the site would, and follows edits live (storage events). */
export function Preview() {
  const [p, setP] = useState<Project | null | undefined>(undefined);
  useEffect(() => {
    const read = () => {
      try {
        const d = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (!d?.project) { setP(null); return; }
        setAssetOverrides(d.overrides || {});
        setP(d.project);
      } catch { setP(null); }
    };
    read();
    const on = (e: StorageEvent) => e.key === KEY && read();
    addEventListener('storage', on);
    return () => removeEventListener('storage', on);
  }, []);
  if (p === undefined) return null;
  if (!p) return <div className={s.loginWrap}><p className={s.hint}>Откройте предпросмотр из админки.</p></div>;
  return (
    <>
      <div className={s.previewBadge} role="status">Предпросмотр · не опубликовано</div>
      <Case project={p} />
    </>
  );
}
