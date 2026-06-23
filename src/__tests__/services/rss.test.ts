import { fetchHealthArticles } from '../../services/rss';

global.fetch = jest.fn();

describe('fetchHealthArticles', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns parsed articles on success', async () => {
    const mockXml = `<?xml version="1.0"?>
      <rss version="2.0"><channel>
        <item>
          <title>Bài viết sức khỏe</title>
          <link>https://vnexpress.net/bai-viet-1.html</link>
          <pubDate>Mon, 24 Jun 2026 10:00:00 +0700</pubDate>
          <description><![CDATA[<img src="https://img.example.com/thumb.jpg"/>Mô tả]]></description>
        </item>
      </channel></rss>`;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockXml,
    });

    const articles = await fetchHealthArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Bài viết sức khỏe');
    expect(articles[0].link).toBe('https://vnexpress.net/bai-viet-1.html');
    expect(articles[0].source).toBe('VnExpress');
  });

  it('returns empty array on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );
    expect(await fetchHealthArticles()).toEqual([]);
  });

  it('returns empty array on non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    expect(await fetchHealthArticles()).toEqual([]);
  });

  it('returns at most 5 articles', async () => {
    const items = Array.from(
      { length: 10 },
      (_, i) => `
      <item>
        <title>Article ${i}</title>
        <link>https://vnexpress.net/article-${i}.html</link>
        <pubDate>Mon, 24 Jun 2026 10:00:00 +0700</pubDate>
      </item>`,
    ).join('');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () =>
        `<?xml version="1.0"?><rss version="2.0"><channel>${items}</channel></rss>`,
    });

    const articles = await fetchHealthArticles();
    expect(articles.length).toBeLessThanOrEqual(5);
  });
});
