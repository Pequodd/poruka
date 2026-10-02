import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32, alignItems: 'flex-start' }}>
      <span className="mono secondary">Ошибка 404</span>
      <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 500 }}>Такой страницы<br />нет</h1>
      <Button href="/">На главную</Button>
    </div>
  );
}
