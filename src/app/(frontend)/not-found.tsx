import Link from 'next/link'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100dvh-14rem)] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">页面不存在</h1>
        <p className="mt-3 text-muted-foreground">你要找的页面可能已被移动或删除。</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          返回首页
        </Link>
      </main>
      <Footer />
    </>
  )
}
