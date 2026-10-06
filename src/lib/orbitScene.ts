/**
 * v7 «bond»: two interlocked glass links — one ultramarine glass, one clear glass with a seal-red core thread.
 * «Порука» is a bond between two parties; the links hold together while they turn.
 * Glass is faked (translucent clearcoat shells, front + back faces) so the canvas stays transparent over any page.
 * On load the links fly in from both sides and lock; scrolling turns the pair, the pointer tilts it.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const RED = 0xff3d14, ULTRA = 0x2f3bff;

/** Closed stadium-shaped path (a chain-link outline) in the XY plane. */
function linkCurve(halfLen: number, rad: number) {
  const pts: THREE.Vector3[] = [];
  const n = 48;
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI; pts.push(new THREE.Vector3(halfLen + Math.cos(a) * rad, Math.sin(a) * rad, 0)); }
  for (let i = 0; i < n; i++) { const a = Math.PI / 2 + (i / n) * Math.PI; pts.push(new THREE.Vector3(-halfLen + Math.cos(a) * rad, Math.sin(a) * rad, 0)); }
  return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
}

export interface OrbitApi { setScroll: (v: number) => void; setActive: (on: boolean) => void; dispose: () => void }

export function mountOrbit(canvas: HTMLCanvasElement, reducedMotion: boolean): OrbitApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 5.4);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-2, 3, 4); scene.add(key);

  const curve = linkCurve(0.42, 0.5);
  const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.17, 40, true);
  const coreGeo = new THREE.TubeGeometry(curve, 240, 0.045, 16, true);

  const clearBack = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, roughness: 0.08, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.4 });
  const clearFront = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.03, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 2.6, iridescence: 0.35, iridescenceIOR: 1.3, depthWrite: false,
  });
  const ultraBack = new THREE.MeshPhysicalMaterial({ color: ULTRA, transparent: true, opacity: 0.45, roughness: 0.1, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.2 });
  const ultraFront = new THREE.MeshPhysicalMaterial({
    color: ULTRA, transparent: true, opacity: 0.62, roughness: 0.04, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 2.2, depthWrite: false,
  });
  const coreMat = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.35, emissive: RED, emissiveIntensity: 0.25, toneMapped: false });

  const mk = (geo: THREE.BufferGeometry, m: THREE.Material, order: number) => { const o = new THREE.Mesh(geo, m); o.renderOrder = order; return o; };
  // Link A: ultramarine glass, flat to the viewer. Link B: clear glass + red thread, turned 90° through A's end.
  const linkA = new THREE.Group(); linkA.add(mk(tubeGeo, ultraBack, 0), mk(tubeGeo, ultraFront, 2));
  const linkB = new THREE.Group(); linkB.add(mk(tubeGeo, clearBack, 0), mk(coreGeo, coreMat, 1), mk(tubeGeo, clearFront, 2));
  const pair = new THREE.Group(); pair.add(linkA, linkB);
  const pivot = new THREE.Group(); pivot.add(pair); pivot.scale.setScalar(0.76); scene.add(pivot);
  const GAP = 0.67; // half the distance between link centres: each link passes through the centre of the other one's end loop

  let scroll = 0, sTarget = 0, px = 0, py = 0, last = 0, active = true;
  const onMove = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
  addEventListener('pointermove', onMove, { passive: true });

  const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);
  const tick = (t: number) => {
    last = t;
    scroll += (sTarget - scroll) * 0.08;
    const k = reducedMotion ? 1 : easeOut((t - 0.1) / 1.5); // intro: links fly in from both sides and lock
    linkA.position.set(-GAP - (1 - k) * 2.6, (1 - k) * 0.6, 0);
    linkB.position.set(GAP + (1 - k) * 2.6, -(1 - k) * 0.6, 0);
    linkA.rotation.set(0, 0, (1 - k) * -1.2);
    linkB.rotation.set(Math.PI / 2, (1 - k) * 1.2, 0);
    if (reducedMotion) pivot.rotation.set(0.35, -0.5, 0.2);
    else pivot.rotation.set(
      0.35 + py * 0.4 + Math.sin(t * 0.45) * 0.08,
      -0.5 + px * 0.6 + scroll * 0.9 + Math.sin(t * 0.3) * 0.15,
      0.2 + Math.sin(t * 0.25) * 0.06,
    );
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
    setScroll(v) { sTarget = v; },
    setActive(on) { active = on; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', onMove);
      [tubeGeo, coreGeo].forEach((g) => g.dispose());
      [clearBack, clearFront, ultraBack, ultraFront, coreMat].forEach((m) => m.dispose());
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
