import type { SearchItem } from '../lib/search';

let cached: Promise<SearchItem[]> | null = null;

/** 只在第一次打开搜索时拉取索引，之后复用同一个 Promise。 */
export function loadSearchIndex(): Promise<SearchItem[]> {
  if (!cached) {
    cached = fetch('/search-index.json')
      .then((response) => (response.ok ? (response.json() as Promise<SearchItem[]>) : []))
      .catch(() => []);
  }

  return cached;
}
