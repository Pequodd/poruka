'use client';
import { Chip } from './Chip';

type Props = { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean };

export function ChipGroup({ label, options, value, onChange, multi = true }: Props) {
  const tog = (o: string) => {
    if (multi) onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
    else onChange(value.includes(o) ? [] : [o]);
  };
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <legend className="mono secondary" style={{ padding: 0, marginBottom: 12 }}>{label}</legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => <Chip key={o} size="lg" active={value.includes(o)} onClick={() => tog(o)}>{o}</Chip>)}
      </div>
    </fieldset>
  );
}
