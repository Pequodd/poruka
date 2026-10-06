/**
 * v7 «orbit»: a ring of eight glass petals — one per process stage. One core is seal red, one ultramarine,
 * the rest are frosted marble. Glass is faked (translucent clearcoat shell over an opaque core) so the canvas
 * can stay transparent and float over any page background. Scroll position spins the ring.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const SEAL = 0xff3d14, ULTRA = 0x2f3bff;
const N = 8;

function leaf(len: number, wid: number) {
  const s = new THREE.Shape();
  s.moveTo(-len / 2, 0);
  s.bezierCurveTo(-len / 4, wid * 0.62, len / 4, wid * 0.62, len / 2, 0);
  s.bezierCurveTo(len / 4, -wid * 0.62, -len / 4, -wid * 0.62, -len / 2, 0);
  return s;
}

function marble() {
  const S = 256, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.fillStyle = '#8E8F8A'; g.fillRect(0, 0, S, S);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 260; i++) {
    const x = rnd() * S, y = rnd() * S, r = 6 + rnd() * 38, l = 60 + rnd() * 150;
    g.fillStyle = `rgba(${l},${l},${l - 4},${0.08 + rnd() * 0.14})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export interface OrbitApi { setScroll: (v: number) => void; setActive: (on: boolean) => void; dispose: () => void }

export function mountOrbit(canvas: HTMLCanvasElement, reducedMotion: boolean): OrbitApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 5.4);
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-2, 3, 4); scene.add(key);

  const shellGeo = new THREE.ExtrudeGeometry(leaf(0.92, 0.5), { depth: 0.04, bevelEnabled: true, bevelThickness: 0.11, bevelSize: 0.08, bevelSegments: 10, curveSegments: 40 });
  shellGeo.center();
  const coreGeo = new THREE.ExtrudeGeometry(leaf(0.74, 0.36), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 6, curveSegments: 32 });
  coreGeo.center();
  const tex = marble();
  const shell = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.15, roughness: 0.06, transparent: true, opacity: 0.38,
    clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.4, iridescence: 0.25, depthWrite: false,
  });
  const cores = [
    new THREE.MeshStandardMaterial({ color: SEAL, roughness: 0.35, metalness: 0.05 }),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: ULTRA, roughness: 0.35, metalness: 0.05 }),
  ];
  const coreOf = (i: number) => (i === 0 ? cores[0] : i === 5 ? cores[2] : cores[1]);

  const ring = new THREE.Group();
  scene.add(ring);
  const petals: { g: THREE.Group; a: number; ph: number }[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const g = new THREE.Group();
    const core = new THREE.Mesh(coreGeo, coreOf(i));
    const sh = new THREE.Mesh(shellGeo, shell);
    sh.renderOrder = 1;
    g.add(core, sh);
    ring.add(g);
    petals.push({ g, a, ph: i * 0.7 });
  }

  let scroll = 0, sTarget = 0, px = 0, py = 0, last = 0, active = true;
  const onMove = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
  addEventListener('pointermove', onMove, { passive: true });

  const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);
  const tick = (t: number) => {
    last = t;
    scroll += (sTarget - scroll) * 0.08;
    const spin = reducedMotion ? 0.2 : t * 0.12 + scroll * 0.9;
    petals.forEach(({ g, a, ph }, i) => {
      const k = reducedMotion ? 1 : easeOut((t - 0.15 - i * 0.07) / 1.3); // intro: petals fly in and settle
      const r = 1.02 + (1 - k) * 1.6;
      const aa = a + spin + (1 - k) * 1.4;
      g.position.set(Math.cos(aa) * r, Math.sin(aa) * r, (1 - k) * 1.5);
      g.rotation.set(reducedMotion ? 0.3 : Math.sin(t * 0.8 + ph) * 0.35 + 0.25, reducedMotion ? 0 : Math.cos(t * 0.6 + ph) * 0.25, aa + Math.PI / 2);
      g.scale.setScalar(Math.max(0.001, k));
      g.visible = k > 0.001 || i === 0;
    });
    ring.rotation.x = reducedMotion ? 0.35 : 0.35 + py * 0.35 + Math.sin(t * 0.3) * 0.05;
    ring.rotation.y = reducedMotion ? -0.2 : -0.2 + px * 0.5;
    renderer.render(scene, camera);
  };

  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 5.4 / (w / h) : 5.4;
    camera.updateProjectionMatrix();
    if (reducedMotion) tick(last);
  };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => { raf = requestAnimationFrame(frame); if (active && !document.hidden) tick((now - t0) / 1000); };
  if (reducedMotion) tick(0); else raf = requestAnimationFrame(frame);

  return {
    setScroll(v) { sTarget = v; if (reducedMotion) tick(last); },
    setActive(on) { active = on; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', onMove);
      shellGeo.dispose(); coreGeo.dispose(); shell.dispose(); cores.forEach((m) => m.dispose()); tex.dispose(); env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
