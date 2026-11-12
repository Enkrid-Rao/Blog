import type { APIRoute } from 'astro';
import { getNotes } from '../lib/notes';
import { posts } from '../data/posts';
import { stripMath } from '../lib/math';
import type { SearchItem } from '../lib/search';

function plainText(markdown: string, limit = 700): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/[>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

function headingList(markdown: string): string[] {
  return [...markdown.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((match) => stripMath(match[1]).trim())
    .filter(Boolean)
    .slice(0, 24);
}

export const GET: APIRoute = async () => {
  const notes = await getNotes();

  const items: SearchItem[] = [
    ...notes.map((note) => ({
      title: stripMath(note.data.title),
      description: note.data.description,
      url: `/notes/${note.id}/`,
      group: '笔记' as const,
      tags: note.data.tags,
      headings: headingList(note.body ?? ''),
      text: plainText(note.body ?? ''),
    })),
    ...posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      url: `/writing/${post.slug}/`,
      group: '日志' as const,
      tags: post.tags,
      headings: [],
      text: post.excerpt,
    })),
    {
      title: '关于',
      description: '关于 rxx，和这个正在重建的站点。',
      url: '/about/',
      group: '页面',
      tags: ['关于'],
      headings: ['现在', '这个站', '联系', '许可'],
      text: '数学、代码与文字之间的一些记录。',
    },
    {
      title: '实验室',
      description: '还没做完的项目、工具和实验。',
      url: '/lab/',
      group: '页面',
      tags: ['实验室', 'diary'],
      headings: ['diary', 'resources'],
      text: '给还没做完的东西留一个位置。',
    },
    {
      title: '使用说明',
      description: '主题、搜索、公式与阅读的简单说明。',
      url: '/guide/',
      group: '页面',
      tags: ['说明'],
      headings: ['主题', '搜索', '公式', '阅读', '订阅'],
      text: '这个站怎么用，以及一些快捷键。',
    },
    {
      title: '归档',
      description: '笔记与日志的时间线。',
      url: '/archive/',
      group: '页面',
      tags: ['归档'],
      headings: [],
      text: '按年份排列的全部笔记与日志。',
    },
    {
      title: '标签',
      description: '按标签浏览笔记与日志。',
      url: '/tags/',
      group: '页面',
      tags: ['标签'],
      headings: [],
      text: '数论、二次剩余、原根、随笔、建站。',
    },
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
