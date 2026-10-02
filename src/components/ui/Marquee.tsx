import s from './Marquee.module.css';

export function Marquee({ words, sealWord, speed = 40 }: { words: string[]; sealWord?: string; speed?: number }) {
  const run = [...words, ...words];
  return (
    <div className={s.marquee} aria-label={words.join(' / ')} role="img">
      <div className={s.track} style={{ ['--speed' as string]: `${speed}s` }} aria-hidden="true">
        {run.map((w, i) => (
          <span key={i} className={s.item}>
            <span className={s.word}>{w}{w === sealWord && <span className={s.seal} />}</span>
            <span className={s.slash}>/</span>
            <span className={s.sep}>⊕</span>
          </span>
        ))}
      </div>
    </div>
  );
}
