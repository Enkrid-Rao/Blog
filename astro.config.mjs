import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 本地默认用主域名；部署到子域名时在 Vercel 里设置 SITE_URL。
const site = process.env.SITE_URL || 'https://251890411.xyz';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            strict: false,
            throwOnError: false,
            output: 'html',
          },
        ],
      ],
    }),
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});

