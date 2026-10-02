import { Button } from '../ui/Button';
import { Stat } from '../ui/Stat';
import { Lead, Section } from './Section';
import s from './Home.module.css';

export function About() {
  return (
    <Section marker="О нас" id="about">
      <Lead parts={['Мы — команда из 3 человек.', <> Проектируем и запускаем сайты для малого и среднего бизнеса<br />— от исследования до поддержки. </>, <><br />Отвечаем за результат своим именем.</>]} />
      <div className={s.stats}>
        <Stat value="10" suffix="+" caption="Лет опыта" />
        <Stat value="40" suffix="+" caption="Проектов" />
        <Stat value="95" suffix="%" caption="Возвращаются" />
      </div>
      <div className={s.btns}>
        <Button href="/#contact" className={s.full}>Обсудить проект</Button>
        <Button variant="secondary" href="/portfolio/" className={s.full}>Смотреть работы</Button>
      </div>
    </Section>
  );
}
