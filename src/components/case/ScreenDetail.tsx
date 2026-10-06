import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import s from './Case.module.css';

type Props = { src?: string; crop?: { x: number; y: number }; why?: string; caption: React.ReactNode };

/** Enlarged crop (×1.5) of one interface fragment in cols 5–12; «Почему так» in cols 1–4. Needs a ≥2× source. */
export function ScreenDetail({ src, crop = { x: 0, y: 0 }, why, caption }: Props) {
  return (
    <div>
      {caption}
      <div className={s.detail}>
        <div className={s.why}>
          <span className={`${s.mono} ${s.whyLabel}`}>Почему так</span>
          {why && <p className={s.whyText}>{why}</p>}
        </div>
        <div className={s.crop}>
          {src ? (
            <img src={asset(src)} alt="" className={s.cropImg} style={{ transform: `translate(-${crop.x}%, -${crop.y}%)` }} loading="lazy" />
          ) : (
            <Placeholder ratio="auto" label="ФРАГМЕНТ ИНТЕРФЕЙСА · ×1.5 · ИСХОДНИК ≥2×" className={s.phFill} />
          )}
        </div>
      </div>
    </div>
  );
}
