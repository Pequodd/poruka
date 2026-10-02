'use client';
import { useState } from 'react';
import { SERVICES } from '@/data/content';
import { ServiceRow } from '../ui/ServiceRow';
import { H2, Section } from './Section';
import s from './Home.module.css';

/** 7 rows, #01 open by default, one open at a time. */
export function Services() {
  const [open, setOpen] = useState(0);
  return (
    <Section marker="Услуги" id="services">
      <div className={s.servicesHead}><H2>Какие задачи решаем</H2></div>
      <div className={s.services}>
        {SERVICES.map((x, i) => <ServiceRow key={x.num} {...x} expanded={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
      </div>
    </Section>
  );
}
