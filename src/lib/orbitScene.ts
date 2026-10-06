/**
 * v7 «glass seal»: the studio's seal cast inside a thick block of clear glass — a paperweight.
 * A red seal coin (ring text «ПОРУКА · РУЧАЕМСЯ ЗА РЕЗУЛЬТАТ», monogram «П») floats in the middle of a rounded
 * glass disc, with a thin ultramarine ring suspended at a different depth so the layers parallax as it turns.
 * Glass is faked (translucent clearcoat shell, front + back faces) so the canvas stays transparent over any page.
 * Scrolling turns the disc on its vertical axis, showing the glass edge; the pointer tilts it.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const SEAL = '#FF3D14', ULTRA = 0x2f3bff;

function drawFace(c: HTMLCanvasElement) {
  const S = c.width, g = c.getContext('2d')!;
  g.clearRect(0, 0, S, S);
  g.fillStyle = SEAL; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#FFFFFF';
  g.lineWidth = 10; g.beginPath(); g.arc(S / 2, S / 2, S * 0.46, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.arc(S / 2, S / 2, S * 0.31, 0, Math.PI * 2); g.stroke();
  const txt = 'ПОРУКА · РУЧАЕМСЯ ЗА РЕЗУЛЬТАТ · ';
  g.fillStyle = '#FFFFFF'; g.font = '400 54px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const R = S * 0.385, step = (Math.PI * 2) / txt.length;
  for (let i = 0; i < txt.length; i++) {
    const a = -Math.PI / 2 + i * step;
    g.save(); g.translate(S / 2 + Math.cos(a) * R, S / 2 + Math.sin(a) * R); g.rotate(a + Math.PI / 2); g.fillText(txt[i], 0, 0); g.restore();
  }
  g.font = '500 300px Onest, sans-serif'; g.fillText('П', S / 2, S / 2 + 14);
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

  // Rounded thick disc: a lathe of a stadium profile (flat faces, fully rounded rim). Axis = Y → turned to face camera.
  const R = 1, H = 0.42, r = H / 2, pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, -H / 2));
  for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + (i / 24) * Math.PI; pts.push(new THREE.Vector2(R - r + Math.cos(a) * r, Math.sin(a) * r)); }
  pts.push(new THREE.Vector2(0, H / 2));
  const glassGeo = new THREE.LatheGeometry(pts, 128);
  const glassBack = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, roughness: 0.08, metalness: 0, side: THREE.BackSide, depthWrite: false, envMapIntensity: 1.4 });
  const glassFront = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.03, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 2.6, iridescence: 0.35, iridescenceIOR: 1.3, side: THREE.FrontSide, depthWrite: false,
  });

  const faceCanvas = document.createElement('canvas'); faceCanvas.width = faceCanvas.height = 1024;
  drawFace(faceCanvas);
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 8; faceTex.center.set(0.5, 0.5); faceTex.rotation = Math.PI / 2;
  document.fonts?.ready.then(() => { drawFace(faceCanvas); faceTex.needsUpdate = true; });
  const coinGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.05, 96, 1);
  const coinSide = new THREE.MeshStandardMaterial({ color: SEAL, roughness: 0.45, toneMapped: false });
  const coinFace = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.5, toneMapped: false });
  const ringGeo = new THREE.TorusGeometry(0.8, 0.022, 16, 128);
  const ringMat = new THREE.MeshStandardMaterial({ color: ULTRA, roughness: 0.3, metalness: 0.1, emissive: ULTRA, emissiveIntensity: 0.25 });

  const disc = new THREE.Group();
  const back = new THREE.Mesh(glassGeo, glassBack); back.renderOrder = 0;
  const coin = new THREE.Mesh(coinGeo, [coinSide, coinFace, coinFace]); coin.renderOrder = 1;
  const ring = new THREE.Mesh(ringGeo, ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = 0.11; ring.renderOrder = 1;
  const front = new THREE.Mesh(glassGeo, glassFront); front.renderOrder = 2;
  disc.add(back, coin, ring, front);
  disc.rotation.x = Math.PI / 2; // lathe axis → toward the camera
  const pivot = new THREE.Group(); pivot.add(disc); scene.add(pivot);

  let scroll = 0, sTarget = 0, px = 0, py = 0, last = 0, active = true;
  const onMove = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
  addEventListener('pointermove', onMove, { passive: true });

  const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);
  const tick = (t: number) => {
    last = t;
    scroll += (sTarget - scroll) * 0.08;
    if (reducedMotion) {
      pivot.rotation.set(0.18, -0.35, 0); pivot.scale.setScalar(1); pivot.position.set(0, 0, 0);
    } else {
      const k = easeOut((t - 0.1) / 1.6); // intro: the seal drops in spinning and settles face-on
      pivot.position.set(0, 0, (1 - k) * 2.2);
      pivot.scale.setScalar(0.55 + k * 0.45);
      pivot.rotation.set(
        0.12 + py * 0.4 + Math.sin(t * 0.5) * 0.06,
        (1 - k) * Math.PI * 2.5 - 0.3 + px * 0.6 + Math.sin(scroll * 1.6) * 0.9 + Math.sin(t * 0.35) * 0.12,
        Math.sin(t * 0.3) * 0.05 + scroll * 0.15,
      );
    }
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
  if (reducedMotion) { tick(0); document.fonts?.ready.then(() => tick(0)); } else raf = requestAnimationFrame(frame);

  return {
    setScroll(v) { sTarget = v; },
    setActive(on) { active = on; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', onMove);
      [glassGeo, coinGeo, ringGeo].forEach((g) => g.dispose());
      [glassBack, glassFront, coinSide, coinFace, ringMat].forEach((m) => m.dispose());
      faceTex.dispose(); env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
