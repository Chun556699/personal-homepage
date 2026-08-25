import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Reveal } from '@/components/site/reveal'
import { formatDate, getPublishedPosts } from '@/lib/posts'

export const revalidate = 300

export const metadata: Metadata = {
  title: '博客',
  description: '技术思考、项目实践与学习笔记。',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getPublishedPosts(50)

  return (
    <>
      <Header />

      <main className="mx-auto min-h-[calc(100dvh-4rem)] max-w-2xl px-5 pb-24 pt-16 sm:px-6 sm:pt-24">
        <Reveal>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">博客</h1>
          <p className="mt-3 text-muted-foreground">技术思考、项目实践与学习笔记。</p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={80}>
            <p className="mt-12 rounded-xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
              还没有发布文章。在{' '}
              <Link href="/admin" className="text-accent underline underline-offset-2">
                管理后台
              </Link>{' '}
              发布后即可在这里看到。
            </p>
          </Reveal>
        ) : (
          <ul className="mt-10 divide-y">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.id} delay={Math.min(i, 8) * 40}>
                <Link href={`/blog/${post.slug}`} className="group block py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="font-medium tracking-tight transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    <time
                      dateTime={post.publishedAt ?? undefined}
                      className="font-mono text-xs text-muted-foreground"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 4).map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </>
  )
}
