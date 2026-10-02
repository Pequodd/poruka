import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';
import { Works } from '@/components/sections/Works';
import { Footer } from '@/components/layout/Footer';
import { Marquee } from '@/components/ui/Marquee';

/** Home v2: Hero → О нас → Работы (B) → Marquee → Услуги → Процесс v2 → Команда → Контакт → Footer. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Works />
      <Marquee words={['Исследуем', 'Проектируем', 'Разрабатываем', 'Поддерживаем', 'Ручаемся']} sealWord="Ручаемся" />
      <Services />
      <Process />
      <Team />
      <Contact />
      <Footer />
    </>
  );
}
