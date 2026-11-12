import { getCollection, type CollectionEntry } from 'astro:content';
import { chapters } from '../data/taxonomy';

export type NoteEntry = CollectionEntry<'notes'>;

export async function getNotes(): Promise<NoteEntry[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft);

  return notes.sort((a, b) => {
    const chapterA = chapters[a.data.chapter as keyof typeof chapters]?.order ?? 99;
    const chapterB = chapters[b.data.chapter as keyof typeof chapters]?.order ?? 99;
    return chapterA - chapterB || a.data.order - b.data.order;
  });
}

export function readingTime(body: string | undefined): number {
  const chars = (body ?? '').replace(/\s/g, '').length;
  return Math.max(3, Math.round(chars / 380));
}

export function formatDate(date: Date | undefined): string {
  if (!date) return '—';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function noteHref(note: NoteEntry): string {
  return `/notes/${note.id}`;
}
