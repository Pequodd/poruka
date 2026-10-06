/**
 * 3D seal (port of three-scenes.js → mountSeal): red disc with a white ring text, idles with a slow wobble,
 * «stamps» toward the viewer on load, hover and click. Seal red is the brand mark — the one sanctioned fill.
 */
import * as THREE from 'three';

const SEAL = 0xff3d14;

function sealFace(center: string) {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.fillStyle = '#FF3D14'; g.fillRect(0, 0, S, S);
  g.strokeStyle = '#FFFFFF';
  g.lineWidth = 10; g.beginPath(); g.arc(S / 2, S / 2, S * 0.47, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.arc(S / 2, S / 2, S * 0.33, 0, Math.PI * 2); g.stroke();
  const txt = 'ПОРУКА · РУЧАЕМСЯ ЗА РЕЗУЛЬТАТ · ';
  g.fillStyle = '#FFFFFF'; g.font = '400 58px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const R = S * 0.4, step = (Math.PI * 2) / txt.length;
  for (let i = 0; i < txt.length; i++) {
    const a = -Math.PI / 2 + i * step;
    g.save(); g.translate(S / 2 + Math.cos(a) * R, S / 2 + Math.sin(a) * R); g.rotate(a + Math.PI / 2); g.fillText(txt[i], 0, 0); g.restore();
  }
  g.font = `500 ${center.length > 4 ? 92 : 150}px Onest, sans-serif`; g.fillText(center, S / 2, S / 2 + 8);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.center.set(0.5, 0.5); t.rotation = -Math.PI / 2;
  return t;
}

export function mountSeal(canvas: HTMLCanvasElement, reducedMotion: boolean, center = '10+') {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 5.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(3, -1, -2); scene.add(rim);

  const face = sealFace(center);
  const side = new THREE.MeshStandardMaterial({ color: SEAL, roughness: 0.5, metalness: 0.05 });
  const top = new THREE.MeshStandardMaterial({ map: face, roughness: 0.55 });
  const discGeo = new THREE.CylinderGeometry(1, 1, 0.2, 96, 1);
  const rimGeo = new THREE.TorusGeometry(1, 0.05, 16, 96);
  const disc = new THREE.Mesh(discGeo, [side, top, side]);
  disc.rotation.x = Math.PI / 2; disc.rotation.y = Math.PI;
  const rimMesh = new THREE.Mesh(rimGeo, side);
  const g = new THREE.Group(); g.add(disc, rimMesh); scene.add(g);

  let stampT = -1, px = 0, py = 0, last = 0;
  const stamp = () => { if (stampT < 0 && !reducedMotion) stampT = 0; };
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5; };
  const onLeave = () => { px = py = 0; };
  canvas.addEventListener('pointerenter', stamp); canvas.addEventListener('click', stamp);
  canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerleave', onLeave);
  const first = setTimeout(stamp, 1300);

  const tick = (t: number) => {
    const dt = Math.min(0.05, t - last); last = t;
    let ry = Math.sin(t * 0.6) * 0.45 + px * 0.8, rx = Math.cos(t * 0.45) * 0.18 + py * 0.6, z = 0, sq = 1;
    if (stampT >= 0) {
      stampT += dt; const k = stampT;
      if (k < 0.35) { const e = k / 0.35; z = 0.9 * Math.sin((e * Math.PI) / 2); ry *= 1 - e; rx *= 1 - e; }
      else if (k < 0.5) { const e = (k - 0.35) / 0.15; z = 0.9 - 1.25 * e * e; ry = rx = 0; }
      else if (k < 1.2) { const e = (k - 0.5) / 0.7; z = -0.35 * (1 - e) * Math.cos(e * 7); sq = 1 - 0.18 * (1 - e) * Math.abs(Math.cos(e * 6)); const b = Math.min(1, e * 1.4); ry *= b; rx *= b; }
      else stampT = -1;
    }
    if (reducedMotion) { rx = 0.12; ry = -0.25; }
    g.rotation.set(rx, ry, reducedMotion ? 0 : Math.sin(t * 0.3) * 0.22);
    g.position.z = z; g.scale.set(1 / Math.sqrt(sq), 1 / Math.sqrt(sq), sq);
    renderer.render(scene, camera);
  };

  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // Keep the whole disc in narrow cells.
    camera.position.z = w / h < 1 ? 5.2 / (w / h) : 5.2;
    camera.updateProjectionMatrix();
    if (reducedMotion) tick(last);
  };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  let vis = true;
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(canvas);
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => { raf = requestAnimationFrame(frame); if (vis) tick((now - t0) / 1000); };
  if (reducedMotion) tick(0); else raf = requestAnimationFrame(frame);

  return {
    stamp,
    dispose() {
      clearTimeout(first); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointerenter', stamp); canvas.removeEventListener('click', stamp);
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
      face.dispose(); side.dispose(); top.dispose(); discGeo.dispose(); rimGeo.dispose(); renderer.dispose();
    },
  };
}
