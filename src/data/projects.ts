export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  status: '规划中' | '进行中' | '已上线';
  description: string;
  meta: string;
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
  },
];
