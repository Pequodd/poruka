import { asset } from '@/lib/asset';
import { Placeholder } from '../ui/Placeholder';
import { BrowserFrame, DESKTOP_PH, PhoneFrame } from './Frames';
import s from './Case.module.css';

/** White full-bleed band: browser 16:10 in cols 1–8, phone in cols 10–12 at the browser's height, bottom-aligned. Mobile: phone only. */
export function ScreenPair({ url, desktop, mobileSrc, caption }: { url?: string; desktop?: string; mobileSrc?: string; caption: React.ReactNode }) {
  return (
    <div className={s.pair}>
      {caption}
      <div className={s.pairGrid}>
        <BrowserFrame url={url} className={s.pairBrowser}>
          {desktop ? <img src={asset(desktop)} alt="" className={s.cover} loading="lazy" /> : <Placeholder ratio="auto" label={DESKTOP_PH} className={s.phFill} />}
        </BrowserFrame>
        <div className={s.pairPhoneCol}><PhoneFrame src={mobileSrc} className={s.pairPhone} /></div>
      </div>
      <div className={s.pairMobile}><PhoneFrame src={mobileSrc} /></div>
    </div>
  );
}
