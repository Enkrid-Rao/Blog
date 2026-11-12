import type { CollectionEntry } from 'astro:content';
import { posts } from '../data/posts';

export type TagEntry = {
  tag: string;
  title: string;
  description: string;
  href: string;
  kind: '笔记' | '日志';
  date?: Date;
};

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}

/** 汇总笔记与日志上的标签，构建时使用。 */
export function collectTagEntries(notes: CollectionEntry<'notes'>[]): TagEntry[] {
  const noteEntries: TagEntry[] = notes.flatMap((note) =>
    note.data.tags.map((tag) => ({
      tag,
      title: note.data.title,
      description: note.data.description,
      href: `/notes/${note.id}/`,
      kind: '笔记' as const,
      date: note.data.updated,
    }))
  );

  const postEntries: TagEntry[] = posts.flatMap((post) =>
    post.tags.map((tag) => ({
      tag,
      title: post.title,
      description: post.excerpt,
      href: `/writing/${post.slug}/`,
      kind: '日志' as const,
      date: new Date(post.date),
    }))
  );

  return [...noteEntries, ...postEntries];
}

export function countTags(entries: TagEntry[]): { tag: string; count: number; href: string }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.tag, (counts.get(entry.tag) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count, href: tagHref(tag) }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}
