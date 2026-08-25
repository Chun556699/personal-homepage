#!/usr/bin/env node
/**
 * GitHub Pages 静态导出构建脚本（npm run build:static）
 *
 * 步骤：
 * 1. 临时把 src/app/(payload) 移出构建（静态托管无法运行 CMS 后台/API）
 * 2. 把各页面的 ISR 段配置（revalidate）临时替换为 false（静态导出不支持 ISR）
 * 3. 以 STATIC_EXPORT=1 运行 next build（输出到 out/，含 basePath/trailingSlash）
 * 4. 写入 .nojekyll（避免 GitHub Pages 忽略 _next 目录）
 * 5. 无论成败都恢复被修改/移动的文件
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const payloadDir = path.join(root, 'src', 'app', '(payload)')
const stashDir = path.join(root, '.payload-stash')
const outDir = path.join(root, 'out')

/** 需要在静态导出时临时改为 revalidate = false 的文件 */
const segmentConfigFiles = [
  'src/app/(frontend)/page.tsx',
  'src/app/(frontend)/blog/page.tsx',
  'src/app/(frontend)/blog/[slug]/page.tsx',
  'src/app/(frontend)/feed.xml/route.ts',
  'src/app/sitemap.ts',
]

function main() {
  if (!fs.existsSync(payloadDir)) {
    console.error(`✗ 找不到 ${payloadDir}，请在项目根目录运行`)
    process.exit(1)
  }

  console.log('▸ 暂移 Payload 后台路由…')
  fs.renameSync(payloadDir, stashDir)

  const originals = new Map()
  try {
    // 清理残留的 .next 类型文件（可能引用已暂移的路由，导致 TS 检查失败）
    fs.rmSync(path.join(root, '.next'), { recursive: true, force: true })

    console.log('▸ 临时关闭 ISR 段配置（静态导出不支持 revalidate/dynamicParams）…')
    for (const rel of segmentConfigFiles) {
      const file = path.join(root, rel)
      if (!fs.existsSync(file)) continue
      const src = fs.readFileSync(file, 'utf8')
      originals.set(file, src)
      const patched = src
        .replace(/export const revalidate = \w+/g, 'export const revalidate = false')
        .replace(/export const dynamicParams = true/g, 'export const dynamicParams = false')
      if (patched !== src) fs.writeFileSync(file, patched)
    }

    console.log('▸ 静态导出构建中（STATIC_EXPORT=1）…')
    execSync('npx next build', {
      stdio: 'inherit',
      env: { ...process.env, STATIC_EXPORT: '1' },
    })

    // GitHub Pages 需要 .nojekyll 才能提供 _next/ 下的资源
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '')

    // 自定义域名：CNAME 文件让 GitHub Pages 将域名绑定持久化在发布产物中
    const customDomain = process.env.CUSTOM_DOMAIN?.trim()
    if (customDomain) {
      fs.writeFileSync(path.join(outDir, 'CNAME'), customDomain + '\n')
      console.log(`▸ 已写入 CNAME: ${customDomain}`)
    }

    console.log(`✓ 构建完成：${outDir}`)
  } finally {
    // 还原段配置
    for (const [file, src] of originals) fs.writeFileSync(file, src)
    // 恢复 Payload 后台路由
    if (fs.existsSync(stashDir)) {
      console.log('▸ 恢复 Payload 后台路由…')
      fs.renameSync(stashDir, payloadDir)
    }
  }
}

try {
  main()
} catch (err) {
  console.error('✗ 构建失败:', err?.message ?? err)
  process.exit(1)
}
