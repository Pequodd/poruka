import { Hero } from '@/components/sections/Hero';
import { HomeRest } from '@/components/sections/HomeRest';

/** Home v2: Hero → О нас → Работы (B) → Marquee → Услуги → Процесс v2 → Команда → Контакт → Footer. */
export default function Home() {
  return (
    <>
      <Hero />
      <HomeRest />
    </>
  );
}
