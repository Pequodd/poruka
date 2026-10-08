'use client';
import { useEffect, type RefObject } from 'react';
import { asset } from '@/lib/asset';
import { prefersReducedMotion } from '@/lib/hooks';

type Src = { video: string; poster: string };
const WIDE: Src = { video: '/assets/v7/hero.mp4', poster: '/assets/v7/hero-poster.jpg' };
const TALL: Src = { video: '/assets/v7/hero-m.mp4', poster: '/assets/v7/hero-poster-m.jpg' };

/**
 * The fluted-glass loop shared by the heroes: wide or tall cut (tall on phones, or always for a portrait frame),
 * poster only with reduced motion, paused while off-screen.
 */
export function useLoopVideo(ref: RefObject<HTMLVideoElement | null>, shape: 'auto' | 'tall' = 'auto') {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const src = shape === 'tall' || matchMedia('(max-width: 767px)').matches ? TALL : WIDE;
    v.poster = asset(src.poster);
    if (prefersReducedMotion()) return;
    v.src = asset(src.video);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, [ref, shape]);
}
