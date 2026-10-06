import { Footer } from '../layout/Footer';
import { Marquee } from '../ui/Marquee';
import { About } from './About';
import { Contact } from './Contact';
import { Process } from './Process';
import { ProcessApple } from './ProcessApple';
import { ProcessStage } from './ProcessStage';
import { Services } from './Services';
import { Team } from './Team';
import { Works } from './Works';

/** Everything below the first screen — shared by all home variants. `process` picks the Process section design. */
export function HomeRest({ process = 'v2' }: { process?: 'v2' | 'apple' | 'stage' }) {
  return (
    <>
      <About />
      <Works />
      <Marquee words={['Исследуем', 'Проектируем', 'Разрабатываем', 'Поддерживаем', 'Ручаемся']} sealWord="Ручаемся" />
      <Services />
      {process === 'apple' ? <ProcessApple /> : process === 'stage' ? <ProcessStage /> : <Process />}
      <Team />
      <Contact />
      <Footer />
    </>
  );
}
