import RSSParser from 'react-native-rss-parser';
import type { Article } from '../types/home';

const VNEXPRESS_HEALTH_RSS = 'https://vnexpress.net/rss/suc-khoe.rss';
const MAX_ARTICLES = 5;

const extractThumbnail = (description: string | undefined): string | null => {
  if (!description) return null;
  const match = description.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
};

export const fetchHealthArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(VNEXPRESS_HEALTH_RSS);
    if (!response.ok) return [];

    const xml = await response.text();
    const feed = await RSSParser.parse(xml);

    return feed.items.slice(0, MAX_ARTICLES).map(item => ({
      title: item.title ?? '',
      link: item.links?.[0]?.url ?? '',
      pubDate: item.published ?? '',
      thumbnail: extractThumbnail(item.description ?? undefined),
      source: 'VnExpress',
    }));
  } catch {
    return [];
  }
};
