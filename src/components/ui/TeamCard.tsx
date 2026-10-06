import { asset } from '@/lib/asset';
import { Placeholder } from './Placeholder';
import s from './TeamCard.module.css';

type Focus = { x: number; y: number; w: number; h: number };
type Props = { name: string; role: string; about?: string; image?: string; objectPosition?: string; focus?: Focus };

/** B&W 3:4 portrait. Hover: the photo blurs, the face stays sharp inside a 1px white frame. */
export function TeamCard({ name, role, about, image, objectPosition = '50% 30%', focus = { x: 30, y: 10, w: 40, h: 38 } }: Props) {
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
        ) : <Placeholder ratio="3/4" />}
      </div>
      <div className={s.info}>
        <span className={s.name}>{name}</span>
        <span className={s.role}>{role}</span>
        {about && <span className={s.about}>{about}</span>}
      </div>
    </div>
  );
}
