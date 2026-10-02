import s from './Stat.module.css';

export function Stat({ value, suffix, caption, onInk }: { value: string; suffix?: string; caption: string; onInk?: boolean }) {
  return (
    <div className={`${s.stat} ${onInk ? s.onInk : ''}`}>
      <div className={s.value}>{value}{suffix && <sup className={s.sup}>{suffix}</sup>}</div>
      <span className={s.caption}>{caption}</span>
    </div>
  );
}
