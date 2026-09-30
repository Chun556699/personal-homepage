import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Reveal } from '@/components/site/reveal'
import { getPublishedPosts, formatDate } from '@/lib/posts'
import { projects, site, skills } from '@/lib/site'

/** ISR：每 5 分钟后台重建一次；GitHub Pages 静态导出模式下关闭 */
export const revalidate = 300

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <Reveal>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </Reveal>
  )
}

export default async function HomePage() {
  const posts = await getPublishedPosts(3)

  return (
    <>
      <Header />

      <main>
        {/* ------------------------------- Hero ------------------------------- */}
        <section className="relative overflow-hidden">
          <div className="hero-backdrop" aria-hidden />
          <div className="mx-auto max-w-2xl px-5 pb-20 pt-24 sm:px-6 sm:pt-32">
            {site.availableForWork && (
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  可接受新机会
                </span>
              </Reveal>
            )}

            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                你好，我是 {site.name}。
                <br />
                <span className="text-muted-foreground">{site.tagline}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                {site.description}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/#projects"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  查看项目
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  联系我
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <div className="ml-1 flex items-center gap-1 text-sm">
                  <a
                    href={site.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    GitHub
                  </a>
                  <a
                    href={site.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    X
                  </a>
                  <a
                    href={site.socials.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Blog
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------- 项目 ------------------------------- */}
        <section id="projects" className="scroll-mt-14 border-t">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
            <SectionHeading label="Selected Work" title="精选项目" />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {projects.map((project, i) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium tracking-tight">{project.name}</h3>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </>
                )

                return (
                  <Reveal key={project.name} delay={(i % 2) * 70}>
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block h-full rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group h-full rounded-xl border p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-sm">
                        {inner}
                      </div>
                    )}
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------ 技术栈 ------------------------------ */}
        <section className="border-t">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
            <SectionHeading label="Stack" title="技术栈" />
            <Reveal delay={80}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------- 最新文章 ----------------------------- */}
        <section className="border-t">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="flex items-end justify-between">
              <SectionHeading label="Writing" title="最新文章" />
              <Reveal>
                <Link
                  href="/blog"
                  className="group mb-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  全部文章
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            {posts.length === 0 ? (
              <Reveal delay={80}>
                <p className="mt-8 rounded-xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
                  还没有发布文章。在{' '}
                  <Link href="/admin" className="text-accent underline underline-offset-2">
                    管理后台
                  </Link>{' '}
                  发布后，这里会自动展示最新内容。
                </p>
              </Reveal>
            ) : (
              <ul className="mt-6 divide-y">
                {posts.map((post, i) => (
                  <Reveal as="li" key={post.id} delay={i * 60}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="font-medium tracking-tight transition-colors group-hover:text-accent">
                        {post.title}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ------------------------------- 联系 ------------------------------- */}
        <section className="border-t">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                一起来聊聊。
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                有想法、机会或只是想打个招呼？我的收件箱永远敞开。
              </p>
              <a
                href={`mailto:${site.email}`}
                className="group mt-6 inline-flex items-center gap-1.5 font-medium text-accent"
              >
                {site.email}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
