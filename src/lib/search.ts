export type SearchItem = {
  title: string;
  description: string;
  url: string;
  group: '笔记' | '日志' | '页面';
  tags: string[];
  headings: string[];
  text: string;
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * 轻量站内搜索：中文按子串匹配，英文忽略大小写。
 * 所有词都要命中（AND），按标题 > 标签 > 小标题 > 摘要 > 正文排序。
 */
export function searchItems(items: SearchItem[], query: string, limit = 12): SearchItem[] {
  const normalized = normalize(query);
  if (!normalized) return [];

  const tokens = normalized.split(' ').filter(Boolean);

  return items
    .map((item) => {
      const title = normalize(item.title);
      const tags = normalize(item.tags.join(' '));
      const headings = normalize(item.headings.join(' '));
      const description = normalize(item.description);
      const text = normalize(item.text);

      let score = 0;
      for (const token of tokens) {
        let tokenScore = 0;
        if (title.includes(token)) tokenScore += title === token ? 120 : 60;
        if (tags.includes(token)) tokenScore += 28;
        if (headings.includes(token)) tokenScore += 22;
        if (description.includes(token)) tokenScore += 14;
        if (text.includes(token)) tokenScore += 6;
        if (tokenScore === 0) return { item, score: -1 };
        score += tokenScore;
      }

      return { item, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
