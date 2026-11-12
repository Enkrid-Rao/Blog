export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  status: '规划中' | '进行中' | '已上线' | '预留';
  description: string;
  meta: string;
  scope: string[];
  stage: string;
};

export const projects: Project[] = [
  {
    slug: 'diary',
    title: 'diary',
    subtitle: 'A quieter place to keep the days.',
    status: '规划中',
    description:
      '一个更私人的记录空间。它不会出现在时间流里，也不急着被谁读到。先留一个位置。',
    meta: 'PRIVATE LOG / 2026',
    scope: [
      '私密记录，不进入公开时间流',
      '先做本地优先，再考虑同步',
      '等它真的值得打开，再放出来',
    ],
    stage:
      '还没有开始写代码。先把要解决的问题写清楚，再决定用什么做——现在只有一个方向，没有进度条。',
  },
];
