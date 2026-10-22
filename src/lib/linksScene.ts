/**
 * Hero window: the two interlocked glass links of «Порука», large and hands-on.
 * Idle: a slow turn; pointer over the window tilts them; drag (mouse or finger) spins them with inertia.
 * Same glass recipe as orbitScene (translucent clearcoat shells, front + back faces) on a transparent canvas.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const RED = 0xff3d14, ULTRA = 0x2f3bff;

function linkCurve(halfLen: number, rad: number) {
  const pts: THREE.Vector3[] = [];
  const n = 48;
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI; pts.push(new THREE.Vector3(halfLen + Math.cos(a) * rad, Math.sin(a) * rad, 0)); }
  for (let i = 0; i < n; i++) { const a = Math.PI / 2 + (i / n) * Math.PI; pts.push(new THREE.Vector3(-halfLen + Math.cos(a) * rad, Math.sin(a) * rad, 0)); }
  return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
}

export interface LinksApi { setActive: (on: boolean) => void; onFirstDrag: (cb: () => void) => void; dispose: () => void }

export function mountLinks(canvas: HTMLCanvasElement, reducedMotion: boolean): LinksApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 6);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-2, 3, 4); scene.add(key);

  const curve = linkCurve(0.42, 0.5);
  const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.17, 40, true);
  const coreGeo = new THREE.TubeGeometry(curve, 240, 0.045, 16, true);
  const clearBack = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.08, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.4 });
  const clearFront = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, roughness: 0.03, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.6, iridescence: 0.35, iridescenceIOR: 1.3, depthWrite: false });
  const ultraBack = new THREE.MeshPhysicalMaterial({ color: ULTRA, transparent: true, opacity: 0.55, roughness: 0.1, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.2 });
  const ultraFront = new THREE.MeshPhysicalMaterial({ color: ULTRA, transparent: true, opacity: 0.72, roughness: 0.04, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.2, depthWrite: false });
  const coreMat = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.35, emissive: RED, emissiveIntensity: 0.25, toneMapped: false });
  const mk = (geo: THREE.BufferGeometry, m: THREE.Material, order: number) => { const o = new THREE.Mesh(geo, m); o.renderOrder = order; return o; };
  const linkA = new THREE.Group(); linkA.add(mk(tubeGeo, ultraBack, 0), mk(tubeGeo, ultraFront, 2));
  const linkB = new THREE.Group(); linkB.add(mk(tubeGeo, clearBack, 0), mk(coreGeo, coreMat, 1), mk(tubeGeo, clearFront, 2));
  const GAP = 0.67;
  linkA.position.set(-GAP, 0, 0);
  linkB.position.set(GAP, 0, 0); linkB.rotation.set(Math.PI / 2, 0, 0);
  const pair = new THREE.Group(); pair.add(linkA, linkB);
  const tilt = new THREE.Group(); tilt.add(pair); tilt.scale.setScalar(0.82); scene.add(tilt);

  // Spin state: angles driven by drag velocity with friction; the idle turn takes over when the hand lets go.
  let rx = 0.35, ry = -0.5, vx = 0, vy = 0.004, px = 0, py = 0, tx = 0, ty = 0;
  let dragging = false, lastX = 0, lastY = 0, active = true, firstCb: (() => void) | null = null;
  const onDown = (e: PointerEvent) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing';
    if (firstCb) { firstCb(); firstCb = null; }
  };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5;
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    vy = dx * 0.01; vx = dy * 0.01; ry += vy; rx += vx;
  };
  const onUp = (e: PointerEvent) => { dragging = false; canvas.style.cursor = 'grab'; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); };
  const onLeave = () => { px = 0; py = 0; };
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);

  const tick = (t: number) => {
    if (!dragging && !reducedMotion) {
      vx *= 0.95; vy = vy * 0.96 + 0.004 * 0.04; // friction, easing back to the idle turn
      rx += vx; ry += vy;
      rx += (0.35 - rx) * 0.01; // settles back to a readable angle
    }
    tx += (py * 0.35 - tx) * 0.06; ty += (px * 0.5 - ty) * 0.06;
    pair.rotation.set(rx, ry, 0);
    tilt.rotation.set(tx + (reducedMotion ? 0 : Math.sin(t * 0.5) * 0.05), ty, reducedMotion ? 0 : Math.sin(t * 0.3) * 0.04);
    renderer.render(scene, camera);
  };

  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 6 / Math.max(0.7, w / h) : 6;
    camera.updateProjectionMatrix();
    if (reducedMotion) tick(0);
  };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => { raf = requestAnimationFrame(frame); if (active && !document.hidden) tick((now - t0) / 1000); };
  raf = requestAnimationFrame(frame);

  return {
    setActive(on) { active = on; },
    onFirstDrag(cb) { firstCb = cb; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('pointerleave', onLeave);
      [tubeGeo, coreGeo].forEach((g) => g.dispose());
      [clearBack, clearFront, ultraBack, ultraFront, coreMat].forEach((m) => m.dispose());
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
