/**
 * Uploaded screenshots are re-encoded to WebP in the browser before they go to GitHub:
 * a full-page PNG of 6–8 MB becomes a few hundred KB, and the site stays fast.
 */
const MAX_W = 2400;

export const slugify = (name: string) => {
  const map: Record<string, string> = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  return name.toLowerCase().replace(/[а-яё]/g, (c) => map[c] ?? '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'image';
};

export async function prepareImage(file: File, slug: string, compress: boolean): Promise<{ path: string; blob: Blob }> {
  const base = slugify(file.name.replace(/\.[^.]+$/, ''));
  const stamp = Date.now().toString(36).slice(-4);
  const dir = `/assets/cases/${slug || 'new'}`;
  if (!compress || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    return { path: `${dir}/${base}-${stamp}.${ext}`, blob: file };
  }
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file); } catch {
    // The browser can't decode it (e.g. HEIC) → upload the file as is.
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    return { path: `${dir}/${base}-${stamp}.${ext}`, blob: file };
  }
  const k = Math.min(1, MAX_W / bmp.width);
  const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.86));
  // Canvas too large for the browser (very long page screenshots) → keep the original file.
  if (!blob || blob.size > file.size) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    return { path: `${dir}/${base}-${stamp}.${ext}`, blob: file };
  }
  return { path: `${dir}/${base}-${stamp}.webp`, blob };
}

export const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} МБ` : `${Math.round(n / 1024)} КБ`);
