import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { formatDate, getPostBySlug, getPublishedPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const revalidate = 600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

/** 构建时预渲染已知文章；数据库不可用（如 Vercel 无库）时返回空数组，按需动态渲染 */
export async function generateStaticParams() {
  const posts = await getPublishedPosts(200)
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: '文章不存在' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const dateLabel = formatDate(post.publishedAt)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    author: { '@type': 'Person', name: site.name, url: site.url },
    url: `${site.url}/blog/${post.slug}`,
  }

  return (
    <>
      <Header />

      <main className="mx-auto min-h-[calc(100dvh-4rem)] max-w-2xl px-5 pb-24 pt-12 sm:px-6 sm:pt-16">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          返回博客
        </Link>

        <article>
          <header className="mt-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              {dateLabel && (
                <time dateTime={post.publishedAt ?? undefined} className="font-mono text-xs">
                  {dateLabel}
                </time>
              )}
              {post.tags && post.tags.length > 0 && (
                <>
                  {dateLabel && <span aria-hidden>·</span>}
                  <ul className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </header>

          {post.content && (
            <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-lexical prose-headings:tracking-tight prose-pre:rounded-lg">
              <RichText data={post.content} />
            </div>
          )}
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      <Footer />
    </>
  )
}
