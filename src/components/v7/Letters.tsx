import s from './V7.module.css';

/** Letters fly in one by one; each word is a no-wrap group so lines only break between words. */
export function Letters({ text, from = 0, tail }: { text: string; from?: number; tail?: React.ReactNode }) {
  let i = from;
  const words = text.split(' ');
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className={s.word}>
          {[...w].map((ch, ci) => <span key={ci} className={s.ltr} style={{ ['--i' as string]: i++ }}>{ch}</span>)}
          {wi === words.length - 1 && tail}
        </span>
      ))}
    </>
  );
}
