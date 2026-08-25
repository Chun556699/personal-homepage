import type { Post } from '@/payload-types'
import staticPosts from '@/content/posts.json'
/**
 * 数据访问层：所有文章读取都经过这里，支持两种内容模式。
 *
 * 1. CMS 模式（默认）—— 从 Payload 读取（本地 SQLite / Docker / Vercel + Turso）
 * 2. 静态模式（STATIC_EXPORT=1）—— 从仓库内 content/posts.json 读取，
 *    用于 GitHub Pages 等纯静态托管。本地后台写作后运行
 *    `npm run export:posts` 把文章导出到 JSON，push 即发布。
 *
 * 所有读取都带优雅降级：数据库不可用时返回空值，页面照常渲染。
 */

export type PostSummary = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'tags' | 'publishedAt'>

const isStaticMode = process.env.STATIC_EXPORT === '1'

function toSummary(post: Post): PostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? null,
    tags: post.tags ?? null,
    publishedAt: post.publishedAt ?? null,
  }
}

/** 已发布静态文章（按发布时间倒序） */
const publishedStaticPosts = (staticPosts as unknown as Post[])
  .filter((p) => p.status === 'published')
  .sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return tb - ta
  })

/** 获取已发布的文章（按发布时间倒序）。无数据时返回 []。 */
export async function getPublishedPosts(limit = 50): Promise<PostSummary[]> {
  if (isStaticMode) {
    return publishedStaticPosts.slice(0, limit).map(toSummary)
  }

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      limit,
      sort: '-publishedAt',
      where: { status: { equals: 'published' } },
    })
    return result.docs.map(toSummary)
  } catch {
    // 数据库不可用（如 Vercel 未配置持久化数据库）
    return []
  }
}

/** 按 slug 获取单篇已发布文章。无数据或不存在时返回 null。 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isStaticMode) {
    return publishedStaticPosts.find((p) => p.slug === slug) ?? null
  }

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatDate(date?: string | null): string | null {
  if (!date) return null
  try {
    return dateFormatter.format(new Date(date))
  } catch {
    return null
  }
}
