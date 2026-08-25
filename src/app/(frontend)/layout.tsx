import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/site/theme-provider'
import { site } from '@/lib/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ['个人主页', '博客', '前端开发', '全栈', site.name],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: site.url,
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: 'summary',
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/feed.xml' },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
