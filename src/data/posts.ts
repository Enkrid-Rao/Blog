export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  type: '随笔' | 'CTF' | '项目';
  excerpt: string;
  reading: string;
  tags: string[];
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
    tags: ['随笔', '建站'],
  },
];

export type PostType = Post['type'];

export const postTypes: { type: PostType; slug: string; title: string; en: string; lede: string }[] = [
  {
    type: '随笔',
    slug: 'essay',
    title: '随笔',
    en: 'Essays',
    lede: '想清楚的和没想清楚的，都先写下来。',
  },
  {
    type: 'CTF',
    slug: 'ctf',
    title: 'CTF Writeups',
    en: 'CTF',
    lede: '题目、环境、走过的弯路，以及最后拿到的那串字符。',
  },
  {
    type: '项目',
    slug: 'project',
    title: '项目记录',
    en: 'Projects',
    lede: '做过的东西，和它们为什么长成这样。',
  },
];

export function postsOfType(type: PostType): Post[] {
  return posts.filter((post) => post.type === type);
}
