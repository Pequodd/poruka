import { HeroV3 } from '@/components/sections/HeroV3';
import { HomeRest } from '@/components/sections/HomeRest';

/** Home v3: centred hero (guilloché behind glass columns) → О нас → Работы → Marquee → Услуги → Процесс (v4 statement intro + v6 stage) → Команда → Контакт → Footer. */
export default function Home() {
  return (
    <>
      <HeroV3 />
      <HomeRest process="stage-statement" />
    </>
  );
}
