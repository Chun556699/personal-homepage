import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts(200)

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
