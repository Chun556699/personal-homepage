#!/usr/bin/env node
/**
 * 把本地 Payload 数据库中的已发布文章导出为 content/posts.json
 * （供 GitHub Pages 静态模式使用）
 *
 * 用法：node --env-file=.env scripts/export-posts.mjs
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const tmp = path.join(root, '.export-posts.tmp.mjs')

const script = `
import fs from 'node:fs'
const [{ getPayload }, { default: config }] = await Promise.all([
  import('payload'),
  import('./src/payload.config.ts'),
])
const payload = await getPayload({ config })
const result = await payload.find({
  collection: 'posts',
  limit: 500,
  sort: '-publishedAt',
  where: { status: { equals: 'published' } },
})
const posts = result.docs.map((p) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt ?? null,
  tags: p.tags ?? null,
  publishedAt: p.publishedAt ?? null,
  status: 'published',
  content: p.content ?? null,
}))
fs.writeFileSync(process.argv[2] ?? '', JSON.stringify(posts, null, 2) + '\\n')
console.log('✓ 导出', posts.length, '篇文章 → content/posts.json')
process.exit(0)
`

try {
  fs.writeFileSync(tmp, script)
  execSync(
    `node --experimental-vm-modules --import tsx ${JSON.stringify(tmp)} ${JSON.stringify(path.join(root, 'src', 'content', 'posts.json'))}`,
    { stdio: 'inherit', env: process.env },
  )
} finally {
  fs.rmSync(tmp, { force: true })
}
