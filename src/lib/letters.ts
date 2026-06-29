import { LetterMeta, Letter } from '@/types/letter';

export async function getLetterIndex(): Promise<LetterMeta[]> {
  const data = await import('@/content/index.json');
  return data.default as LetterMeta[];
}

export async function getLetterContent(file: string): Promise<string> {
  try {
    const res = await fetch(`/letters/${file}.md`);
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

export function parseMarkdown(raw: string): string {
  return raw.trim();
}
