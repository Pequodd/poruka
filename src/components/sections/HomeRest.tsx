import { Footer } from '../layout/Footer';
import { Marquee } from '../ui/Marquee';
import { About } from './About';
import { Contact } from './Contact';
import { Process } from './Process';
import { Services } from './Services';
import { Team } from './Team';
import { Works } from './Works';

/** Everything below the first screen — shared by all home variants. */
export function HomeRest() {
  return (
    <>
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
