/**
 * Hero «Сцепка»: a chain of glass links stretched diagonally across the screen, binding «Дизайн» to «Разработку».
 * Links alternate ultramarine / clear-with-red-core and turn 90° to each other like a real chain; the whole chain
 * slowly rolls around its own axis, sways, and tilts toward the pointer. Transparent canvas over the paper.
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

export interface ChainApi { setActive: (on: boolean) => void; dispose: () => void }

export function mountChain(canvas: HTMLCanvasElement, reducedMotion: boolean, count = 9): ChainApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-2, 3, 4); scene.add(key);

  const curve = linkCurve(0.42, 0.5);
  const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.17, 32, true);
  const coreGeo = new THREE.TubeGeometry(curve, 200, 0.045, 12, true);
  const clearBack = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.08, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.4 });
  const clearFront = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.26, roughness: 0.03, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.6, iridescence: 0.35, iridescenceIOR: 1.3, depthWrite: false });
  const ultraBack = new THREE.MeshPhysicalMaterial({ color: ULTRA, transparent: true, opacity: 0.5, roughness: 0.1, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.2 });
  const ultraFront = new THREE.MeshPhysicalMaterial({ color: ULTRA, transparent: true, opacity: 0.68, roughness: 0.04, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.2, depthWrite: false });
  const coreMat = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.35, emissive: RED, emissiveIntensity: 0.25, toneMapped: false });
  const mk = (geo: THREE.BufferGeometry, m: THREE.Material, order: number) => { const o = new THREE.Mesh(geo, m); o.renderOrder = order; return o; };

  // Chain along local X: link centres 1.34 apart (each passes through the next one's end loop), every other link turned 90°.
  const STEP = 1.34;
  const chain = new THREE.Group();
  const links: THREE.Group[] = [];
  for (let i = 0; i < count; i++) {
    const g = new THREE.Group();
    if (i % 2 === 0) g.add(mk(tubeGeo, ultraBack, 0), mk(tubeGeo, ultraFront, 2));
    else g.add(mk(tubeGeo, clearBack, 0), mk(coreGeo, coreMat, 1), mk(tubeGeo, clearFront, 2));
    g.position.x = (i - (count - 1) / 2) * STEP;
    g.rotation.x = i % 2 ? Math.PI / 2 : 0;
    chain.add(g); links.push(g);
  }
  const diag = new THREE.Group(); diag.add(chain); scene.add(diag);

  let px = 0, py = 0, tx = 0, ty = 0, active = true, last = 0;
  const onMove = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
  addEventListener('pointermove', onMove, { passive: true });

  let angle = 0.42; // diagonal: bottom-left → top-right
  const tick = (t: number) => {
    last = t;
    tx += (py * 0.25 - tx) * 0.05; ty += (px * 0.35 - ty) * 0.05;
    chain.rotation.x = reducedMotion ? 0.5 : t * 0.25; // the chain rolls around its own axis
    links.forEach((g, i) => { g.position.y = reducedMotion ? 0 : Math.sin(t * 0.9 + i * 0.55) * 0.12; }); // a soft wave runs along it
    diag.rotation.set(tx, ty, angle);
    renderer.render(scene, camera);
  };

  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    angle = w / h < 1 ? 1.05 : 0.42; // steeper on portrait screens
    // Fit the chain's length into the frame along its diagonal.
    const len = count * STEP;
    const vFov = (camera.fov * Math.PI) / 180;
    const fitW = (len * Math.cos(angle)) / (2 * Math.tan(vFov / 2) * camera.aspect);
    const fitH = (len * Math.sin(angle)) / (2 * Math.tan(vFov / 2));
    camera.position.set(0, 0, Math.max(fitW, fitH) * 0.92);
    camera.updateProjectionMatrix();
    if (reducedMotion) tick(last);
  };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => { raf = requestAnimationFrame(frame); if (active && !document.hidden) tick((now - t0) / 1000); };
  if (reducedMotion) tick(0); else raf = requestAnimationFrame(frame);

  return {
    setActive(on) { active = on; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', onMove);
      [tubeGeo, coreGeo].forEach((g) => g.dispose());
      [clearBack, clearFront, ultraBack, ultraFront, coreMat].forEach((m) => m.dispose());
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
