'use client';
import { useEffect } from 'react';
import { clientFamily } from '@/lib/fonts';

/**
 * Loads only the glyphs of «Аа Бб 123» in the client's font for the specimen.
 * Injected after mount on purpose: if Google Fonts is unreachable the specimen just falls back to Onest
 * and nothing else on the page (or client navigation) depends on it.
 */
export function ClientFont({ font }: { font: string }) {
  useEffect(() => {
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clientFamily(font))}:wght@500&text=${encodeURIComponent('Аа Бб 123')}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [font]);
  return null;
}
