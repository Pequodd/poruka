/**
 * Process scene (port of three-scenes.js → mountProcess): 64 instanced blocks, one seal red,
 * re-form at every step: scatter → clusters → bar chart → moodboard → ring → seal → page stack → cube.
 */
import * as THREE from 'three';

const SEAL = 0xff3d14, PAPER = 0xf3f3f1, N = 64;

type L = { p: number[]; s: number[]; r: number[] };
const H = (o: Partial<L> = {}): L => ({ p: [0, 0, 0], s: [0.001, 0.001, 0.001], r: [0, 0, 0], ...o });

function buildLayouts(): L[][] {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const fns: (() => L[])[] = [
    // 01 Бриф — разрозненные мысли
    () => Array.from({ length: N }, () => H({ p: [(rnd() - 0.5) * 3.4, (rnd() - 0.5) * 2, (rnd() - 0.5) * 2], s: [0.14, 0.14, 0.14], r: [rnd() * 6, rnd() * 6, rnd() * 6] })),
    // 02 Исследования — три кластера
    () => Array.from({ length: N }, (_, i) => {
      const c = [[-1.1, 0.3, 0], [0.2, -0.4, 0.4], [1.1, 0.4, -0.3]][i % 3];
      return H({ p: c.map((v) => v + (rnd() - 0.5) * 0.7), s: [0.11, 0.11, 0.11], r: [rnd() * 6, rnd() * 6, 0] });
    }),
    // 03 Визуальный анализ — столбчатая диаграмма
    () => Array.from({ length: N }, (_, i) => {
      const x = i % 8, z = Math.floor(i / 8), h = 0.15 + 1.3 * Math.abs(Math.sin(x * 0.7 + z * 0.45)) * (1 - z / 10);
      return H({ p: [(x - 3.5) * 0.3, h / 2 - 0.8, (z - 3.5) * 0.3], s: [0.22, h, 0.22] });
    }),
    // 04 Референсы — мудборд из пластин
    () => Array.from({ length: N }, (_, i) => i < 16
      ? H({ p: [((i % 4) - 1.5) * 0.72, (Math.floor(i / 4) - 1.5) * 0.54, (rnd() - 0.5) * 0.3], s: [0.62, 0.44, 0.02], r: [(rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.3, (rnd() - 0.5) * 0.12] })
      : H()),
    // 05 Визуальная концепция — кольцо
    () => Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return H({ p: [Math.cos(a) * 1.15, Math.sin(a) * 1.15, Math.sin(a * 3) * 0.15], s: [0.1, 0.26, 0.1], r: [0, 0, a] });
    }),
    // 06 Согласование — печать
    () => {
      const out = [H({ p: [0, 0, 0.06], s: [0.3, 0.3, 0.1] })];
      let k = 1;
      for (const [rad, cnt] of [[0.42, 10], [0.78, 20], [1.12, 33]])
        for (let j = 0; j < cnt && k < N; j++, k++) {
          const a = (j / cnt) * Math.PI * 2;
          out.push(H({ p: [Math.cos(a) * rad, Math.sin(a) * rad, 0], s: [0.16, 0.16, 0.08], r: [0, 0, a] }));
        }
      while (out.length < N) out.push(H());
      return out;
    },
    // 07 Дизайн всех страниц — стопка десктоп- и мобильных макетов
    () => Array.from({ length: N }, (_, i) => i < 5
      ? H({ p: [-0.35 + i * 0.07, 0.12 - i * 0.07, -i * 0.22], s: [1.7, 1.05, 0.02] })
      : i < 8 ? H({ p: [1.05 + (i - 5) * 0.08, -0.35 - (i - 5) * 0.05, 0.35 - (i - 5) * 0.2], s: [0.42, 0.82, 0.02] }) : H()),
    // 08 Передача в разработку — собранный куб
    () => Array.from({ length: N }, (_, i) => H({ p: [((i % 4) - 1.5) * 0.3, ((Math.floor(i / 4) % 4) - 1.5) * 0.3, (Math.floor(i / 16) - 1.5) * 0.3], s: [0.27, 0.27, 0.27] })),
  ];
  return fns.map((f) => f());
}

/**
 * muted: blocks in a dim grey so the object supports the copy instead of competing with it.
 * palette 'glass' (v7): pale frosted blocks with a clearcoat sheen on paper, the accent block ultramarine.
 */
export function mountProcess(canvas: HTMLCanvasElement, reducedMotion: boolean, muted = false, palette: 'default' | 'glass' = 'default') {
  const LAYOUTS = buildLayouts();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1.6, 0.1, 50);
  camera.position.set(0, 0.2, 6.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(3, -1, -2); scene.add(rim);

  const geo = new THREE.BoxGeometry(1, 1, 1);
  const glass = palette === 'glass';
  const mat = glass
    ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1 })
    : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.05 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const col = new THREE.Color();
  for (let i = 0; i < N; i++) mesh.setColorAt(i, col.setHex(glass ? (i === 0 ? 0x2f3bff : i % 9 === 4 ? 0x8f98ff : i % 9 === 7 ? 0xc3c8ff : 0xdcdde6) : i === 0 ? SEAL : muted ? 0x6b6b68 : PAPER));
  const g = new THREE.Group(); g.add(mesh); scene.add(g);

  const cur = LAYOUTS[0].map((o) => ({
    p: new THREE.Vector3(...(o.p as [number, number, number])),
    s: new THREE.Vector3(...(o.s as [number, number, number])),
    q: new THREE.Quaternion().setFromEuler(new THREE.Euler(...(o.r as [number, number, number]))),
  }));
  let target = 0, px = 0, py = 0, changed = 0, last = 0;
  const m4 = new THREE.Matrix4(), tp = new THREE.Vector3(), ts = new THREE.Vector3(), tq = new THREE.Quaternion(), e = new THREE.Euler();

  const onMove = (ev: PointerEvent) => { const r = canvas.getBoundingClientRect(); px = (ev.clientX - r.left) / r.width - 0.5; py = (ev.clientY - r.top) / r.height - 0.5; };
  const onLeave = () => { px = py = 0; };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);

  const tick = (t: number) => {
    const dt = Math.min(0.05, t - last); last = t;
    const L = LAYOUTS[target];
    for (let i = 0; i < N; i++) {
      const d = Math.min(1, (t - changed) * 2.2 - (i % 16) * 0.035); // 35ms stagger
      const k = reducedMotion ? 1 : d > 0 ? 1 - Math.pow(1 - 0.085, dt * 60) : 0;
      tp.set(L[i].p[0], L[i].p[1], L[i].p[2]); ts.set(L[i].s[0], L[i].s[1], L[i].s[2]);
      tq.setFromEuler(e.set(L[i].r[0], L[i].r[1], L[i].r[2]));
      if (!reducedMotion) tp.y += Math.sin(t * 1.2 + i * 0.4) * 0.025;
      cur[i].p.lerp(tp, k); cur[i].s.lerp(ts, k); cur[i].q.slerp(tq, k);
      mesh.setMatrixAt(i, m4.compose(cur[i].p, cur[i].q, cur[i].s));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!reducedMotion) {
      g.rotation.y += (Math.sin(t * 0.25) * 0.5 + px * 0.9 - g.rotation.y) * 0.05;
      g.rotation.x += (0.18 + py * 0.5 - g.rotation.x) * 0.05;
    } else g.rotation.set(0.18, 0, 0);
    renderer.render(scene, camera);
  };

  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the object inside narrow (mobile) frames.
    camera.position.z = w / h < 1.2 ? 6.2 * Math.min(1.6, 1.2 / (w / h)) : 6.2;
    camera.updateProjectionMatrix();
    if (reducedMotion) tick(last);
  };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  let vis = true;
  const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; }); io.observe(canvas);
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => { raf = requestAnimationFrame(frame); if (vis) tick((now - t0) / 1000); };
  if (reducedMotion) tick(0); else raf = requestAnimationFrame(frame);

  return {
    setStep(i: number) {
      if (i === target) return;
      target = Math.max(0, Math.min(LAYOUTS.length - 1, i));
      changed = last;
      if (reducedMotion) tick(last);
    },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
      geo.dispose(); mat.dispose(); mesh.dispose(); renderer.dispose();
    },
  };
}
