'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';
import type { OrbitApi } from '@/lib/orbitScene';
import s from './V7.module.css';

/**
 * The page-wide glass seal. Sections declare a pose with data-orbit="x y scale blur opacity"
 * (x in vw, y in vh); the director interpolates between poses by scroll, so the seal travels,
 * grows and drifts out of focus between blocks — the reference's signature move.
 */
type Pose = [number, number, number, number, number];
const parse = (v: string | null): Pose => {
  const n = (v || '').trim().split(/\s+/).map(Number);
  return [n[0] || 0, n[1] || 0, n[2] ?? 1, n[3] || 0, n[4] ?? 1];
};
const smooth = (x: number) => x * x * (3 - 2 * x);

export function Orbit() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rm = prefersReducedMotion();
    const mobile = matchMedia('(max-width: 767px)').matches;
    let api: OrbitApi | null = null, dead = false;
    import('@/lib/orbitScene').then(({ mountOrbit }) => {
      if (dead || !cv.current) return;
      try { api = mountOrbit(cv.current, rm); } catch { /* no WebGL */ }
    });

    let keys: { y: number; p: Pose }[] = [];
    const measure = () => {
      const vh = innerHeight;
      keys = [];
      document.querySelectorAll<HTMLElement>('[data-orbit]').forEach((el) => {
        const top = el.getBoundingClientRect().top + scrollY, h = el.offsetHeight;
        const p = parse(el.getAttribute(mobile ? 'data-orbit-m' : 'data-orbit') ?? el.getAttribute('data-orbit'));
        if (mobile && !el.hasAttribute('data-orbit-m')) p[0] *= 0.35;
        const a = top - vh * 0.5 + vh * 0.2, b = top + h - vh * 0.5 - vh * 0.2;
        if (b > a) keys.push({ y: a, p }, { y: b, p }); else keys.push({ y: (a + b) / 2, p });
      });
      keys.sort((m, n) => m.y - n.y);
    };
    const target = (): Pose => {
      const y = scrollY;
      if (!keys.length) return [0, 0, 1, 0, 1];
      if (y <= keys[0].y) return keys[0].p;
      for (let i = 1; i < keys.length; i++) {
        if (y <= keys[i].y) {
          const A = keys[i - 1], B = keys[i];
          const k = smooth((y - A.y) / Math.max(1, B.y - A.y));
          return A.p.map((v, j) => v + (B.p[j] - v) * k) as Pose;
        }
      }
      return keys[keys.length - 1].p;
    };

    let cur: Pose | null = null, raf = 0;
    const apply = () => {
      raf = 0;
      const t = target();
      if (!cur) cur = [...t];
      let moving = false;
      cur = cur.map((v, j) => {
        const n = rm ? t[j] : v + (t[j] - v) * 0.12;
        if (Math.abs(n - t[j]) > 0.002) moving = true;
        return n;
      }) as Pose;
      const [x, y, sc, b, o] = cur;
      const el = wrap.current;
      if (el) {
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}vw), calc(-50% + ${y.toFixed(2)}vh), 0) scale(${sc.toFixed(3)})`;
        el.style.filter = b > 0.4 ? `blur(${b.toFixed(1)}px)` : 'none';
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      }
      api?.setActive(o >= 0.01);
      api?.setScroll(scrollY / innerHeight);
      if (moving) raf = requestAnimationFrame(apply);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const remeasure = () => { measure(); kick(); };
    measure(); apply();
    const ro = new ResizeObserver(remeasure); ro.observe(document.body);
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', remeasure);
    return () => {
      dead = true; cancelAnimationFrame(raf); ro.disconnect();
      removeEventListener('scroll', kick); removeEventListener('resize', remeasure); api?.dispose();
    };
  }, []);

  return (
    <div ref={wrap} className={s.orbit} aria-hidden="true">
      <canvas ref={cv} className={s.orbitCanvas} />
    </div>
  );
}
