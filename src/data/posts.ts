export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  type: '随笔' | 'CTF' | '项目';
  excerpt: string;
  reading: string;
};

export const posts: Post[] = [
  {
    slug: 'rebuilding-this-site',
    title: '重建这个站点',
    date: '2026-11-11',
    displayDate: '2026.11.11',
    type: '随笔',
    excerpt: '把笔记和写作分开，把视觉重新做一遍。',
    reading: '4 min',
  },
];
