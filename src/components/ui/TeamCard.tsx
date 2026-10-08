import { asset } from '@/lib/asset';
import { Placeholder } from './Placeholder';
import s from './TeamCard.module.css';

type Focus = { x: number; y: number; w: number; h: number };
type Props = { name: string; role: string; about?: string; image?: string; objectPosition?: string; focus?: Focus; neural?: boolean };

/**
 * A teammate nobody has seen: a generated head-and-shoulders silhouette made of halftone dots (B&W like the photos),
 * with scanlines and an occasional glitch slice. Deliberately generic — not anyone's likeness.
 */
function NeuralPortrait({ name, role }: { name: string; role: string }) {
  const id = name.replace(/\W/g, '') || 'n';
  const body = (
    <>
      <rect width="300" height="400" fill={`url(#bg-${id})`} />
      <g mask={`url(#m-${id})`}><rect width="300" height="400" fill={`url(#dots-${id})`} /></g>
    </>
  );
  return (
    <div className={s.neural} role="img" aria-label={`${name}, ${role}: нейросетевой портрет — вживую его никто не видел`}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={s.neuralSvg} aria-hidden="true">
        <defs>
          <radialGradient id={`bg-${id}`} cx="50%" cy="38%" r="75%"><stop offset="0" stopColor="#3a3a3a" /><stop offset="1" stopColor="#0e0e0e" /></radialGradient>
          <pattern id={`dots-${id}`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="2.1" fill="#e9e9e6" /></pattern>
          <radialGradient id={`fade-${id}`} cx="50%" cy="34%" r="70%"><stop offset="0.35" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0.15" /></radialGradient>
          <mask id={`m-${id}`}>
            <g fill={`url(#fade-${id})`}>
              <ellipse cx="150" cy="150" rx="62" ry="78" />
              <path d="M124 214 h52 v34 c0 6 4 10 10 12 l58 20 c26 9 44 34 44 62 v58 H-38 v-58 c0-28 18-53 44-62 l58-20 c6-2 10-6 10-12z" />
            </g>
          </mask>
        </defs>
        {body}
        {/* glitch slices: copies of the figure in thin bands, nudged sideways now and then */}
        <g className={s.slice1}>{body}</g>
        <g className={s.slice2}>{body}</g>
      </svg>
      <span className={s.scan} aria-hidden="true" />
      <span className={`${s.neuralTag} mono`} aria-hidden="true">AI</span>
    </div>
  );
}

export function TeamCard({ name, role, about, image, objectPosition = '50% 30%', focus = { x: 30, y: 10, w: 40, h: 38 }, neural }: Props) {
  const clip = `inset(${focus.y}% ${100 - focus.x - focus.w}% ${100 - focus.y - focus.h}% ${focus.x}%)`;
  return (
    <div className={s.card}>
      <div className={s.photo}>
        {image ? (
          <>
            <img src={asset(image)} alt={`${name}, ${role}`} className={`${s.img} ${s.base}`} style={{ objectPosition }} loading="lazy" />
            <img src={asset(image)} alt="" aria-hidden="true" className={`${s.img} ${s.sharp}`} style={{ objectPosition, clipPath: clip }} loading="lazy" />
            <span aria-hidden="true" className={s.frame} style={{ left: `${focus.x}%`, top: `${focus.y}%`, width: `${focus.w}%`, height: `${focus.h}%` }} />
          </>
        ) : neural ? <NeuralPortrait name={name} role={role} /> : <Placeholder ratio="3/4" />}
      </div>
      <div className={s.info}>
        <span className={s.name}>{name}</span>
        <span className={s.role}>{role}</span>
        {about && <span className={s.about}>{about}</span>}
      </div>
    </div>
  );
}
