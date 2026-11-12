import rss from '@astrojs/rss';
import { site as siteData } from '../data/site';
import { posts } from '../data/posts';

export function GET(context: { site: URL | undefined }) {
  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(post.date),
      link: `/writing/${post.slug}/`,
      categories: [post.type],
    })),
    customData: `<language>zh-cn</language>`,
  });
}
