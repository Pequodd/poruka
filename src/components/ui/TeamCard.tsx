import { asset } from '@/lib/asset';
import { Placeholder } from './Placeholder';
import s from './TeamCard.module.css';

type Focus = { x: number; y: number; w: number; h: number };
type Props = { name: string; role: string; about?: string; image?: string; objectPosition?: string; focus?: Focus; code?: { file: string; stack: string[] } };

/**
 * A portrait for a teammate without a photo: an editor window where the person is typed out as an object
 * line by line when the card comes into view; `photo: null` — still compiling.
 */
function CodePortrait({ name, role, file, stack }: { name: string; role: string; file: string; stack: string[] }) {
  const id = file.replace(/\.\w+$/, '');
  const lines: React.ReactNode[] = [
    <><i className={s.kw}>const</i> {id} = {'{'}</>,
    <>  name: <b className={s.str}>&apos;{name}&apos;</b>,</>,
    <>  role: <b className={s.str}>&apos;{role.replace(/‑разработчик$/, '')}&apos;</b>,</>,
    <>  stack: [</>,
    ...stack.map((t, i) => <>    <b className={s.str}>&apos;{t}&apos;</b>{i < stack.length - 1 ? ',' : ''}</>),
    <>  ],</>,
    <>  photo: <i className={s.kw}>null</i>, <span className={s.cmt}>{'// компилируется…'}</span></>,
    <>{'};'}<span className={s.caret} aria-hidden="true" /></>,
  ];
  return (
    <div className={s.code} role="img" aria-label={`${name}, ${role}: фото пока нет, вместо него — карточка в виде кода`}>
      <div className={s.codeBar} aria-hidden="true"><span /><span /><span /><em>{file}</em></div>
      <pre className={s.codeBody} aria-hidden="true">
        {lines.map((l, i) => (
          <span key={i} className={s.line} style={{ ['--i' as string]: i }}><span className={s.ln}>{String(i + 1).padStart(2, '0')}</span>{l}</span>
        ))}
      </pre>
    </div>
  );
}

/** B&W 3:4 portrait. Hover: the photo blurs, the face stays sharp inside a 1px white frame. */
export function TeamCard({ name, role, about, image, objectPosition = '50% 30%', focus = { x: 30, y: 10, w: 40, h: 38 }, code }: Props) {
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
        ) : code ? <CodePortrait name={name} role={role} file={code.file} stack={code.stack} /> : <Placeholder ratio="3/4" />}
      </div>
      <div className={s.info}>
        <span className={s.name}>{name}</span>
        <span className={s.role}>{role}</span>
        {about && <span className={s.about}>{about}</span>}
      </div>
    </div>
  );
}
