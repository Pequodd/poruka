'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

/**
 * Live guilloché rosette (the security pattern of guarantee documents): ~58 interfering rose curves in seal red.
 * r(θ) = base + 0.045R·sin(18θ+φ) + 0.03R·sin(7θ−1.7φ+6f) + cursor term. Phase drifts; rings bend toward the cursor.
 */
type Props = { pointer: Ptr; className?: string; /** stroke width, px */ lineWidth?: number; /** stroke opacity */ alpha?: number };

export function Guilloche({ pointer, className, lineWidth = 1, alpha = 0.55 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext('2d');
    if (!g) return;
    const RM = prefersReducedMotion();
    let raf = 0, cx = 0.5, cy = 0.5, amp = 0, visible = true;
    const t0 = performance.now();
    const fit = () => {
      const d = Math.min(2, devicePixelRatio || 1);
      c.width = c.clientWidth * d; c.height = c.clientHeight * d;
      g.setTransform(d, 0, 0, d, 0, 0);
      if (RM) draw(t0);
    };
    const draw = (now: number) => {
      const t = RM ? 0 : (now - t0) / 1000;
      const W = c.clientWidth, H = c.clientHeight;
      g.clearRect(0, 0, W, H);
      const mobile = W < 600;
      cx += (pointer.current.x - cx) * 0.05;
      cy += (pointer.current.y - cy) * 0.05;
      amp += ((Math.hypot(cx - 0.5, cy - 0.5) < 0.6 ? 1 : 0) - amp) * 0.03;
      const R = Math.min(W, H) * 0.48, ox = W / 2, oy = H / 2;
      const rings = mobile ? 34 : 58, SEG = mobile ? 360 : 540;
      g.lineWidth = lineWidth;
      g.strokeStyle = `rgba(255,61,20,${alpha})`;
      for (let i = 0; i < rings; i++) {
        const f = i / (rings - 1);
        const base = R * (0.18 + 0.82 * f);
        const ph = t * 0.12 + f * 2.4 + (cx - 0.5) * 3 * f;
        g.beginPath();
        for (let s = 0; s <= SEG; s++) {
          const a = (s / SEG) * Math.PI * 2;
          const r = base + R * 0.045 * Math.sin(18 * a + ph) + R * 0.03 * Math.sin(7 * a - ph * 1.7 + f * 6) + R * 0.02 * amp * Math.sin(3 * a + (cy - 0.5) * 8);
          const x = ox + Math.cos(a) * r, y = oy + Math.sin(a) * r;
          if (s) g.lineTo(x, y); else g.moveTo(x, y);
        }
        g.globalAlpha = 0.25 + 0.75 * Math.pow(f, 1.5);
        g.stroke();
      }
      g.globalAlpha = 1;
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(now);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    if (RM) draw(t0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [pointer, lineWidth, alpha]);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
