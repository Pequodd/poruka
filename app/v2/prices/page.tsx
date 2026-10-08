import type { Metadata } from 'next';
import { FooterV7 } from '@/components/v7/FooterV7';
import { Look } from '@/components/v7/Look';
import { Orbit } from '@/components/v7/Orbit';
import { PricingRows } from '@/components/v8/PricingRows';
import { PricingTable } from '@/components/v8/PricingTable';
import { PricingTabs } from '@/components/v8/PricingTabs';
import { PricingV8 } from '@/components/v8/PricingV8';
import s from '@/components/v7/V7.module.css';
import x from '@/components/v8/V8.module.css';

// Comparison page for the price block: the four variants one after another.
export const metadata: Metadata = { title: 'ПОРУКА — варианты блока цен', robots: { index: false, follow: false } };

const Label = ({ k, name, note }: { k: string; name: string; note: string }) => (
  <div className={x.variantLabel}><b>Вариант {k}</b><span>{name}</span><span className="mono">{note}</span></div>
);

export default function Page() {
  return (
    <div className={s.page}>
      <Look />
      <Orbit />
      <div className={s.content}>
        <div className={x.variantsIntro}><span className="mono">Блок «Форматы и цены»</span><h1>4 варианта</h1></div>
        <Label k="A" name="Карточки" note="сейчас на /v2/" />
        <PricingV8 />
        <Label k="B" name="Строки" note="типографичный список, раскрывается по клику" />
        <PricingRows />
        <Label k="C" name="Переключатель" note="один формат крупно, остальные — в переключателе" />
        <PricingTabs />
        <Label k="D" name="Сравнение" note="таблица «что входит» по форматам" />
        <PricingTable />
        <FooterV7 />
      </div>
    </div>
  );
}
