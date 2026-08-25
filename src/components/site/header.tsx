'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Rss, Sun } from 'lucide-react'
import { site } from '@/lib/site'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
] as const

/**
 * 主题切换按钮。
 * 图标显隐完全由 .dark 类驱动（CSS），SSR 与客户端渲染结果一致，
 * 无需 mounted 状态、无水合警告；点击时读取 resolvedTheme 切换。
 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-border bg-background/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          {site.name}
          <span className="text-accent">.</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="主导航">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/feed.xml"
            aria-label="RSS 订阅"
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            <Rss className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
