import { getPublishedPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const revalidate = 3600

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET() {
  const posts = await getPublishedPosts(20)

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} · ${site.role}`)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
