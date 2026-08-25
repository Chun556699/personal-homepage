import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * STATIC_EXPORT=1 时切换为纯静态导出模式（GitHub Pages 等静态托管）：
 * - output: 'export'        产物输出到 out/
 * - trailingSlash: true     生成 目录/index.html，保证 GitHub Pages 上无后缀 URL 可访问
 * - images.unoptimized      静态托管无法运行图片优化服务
 * - basePath                项目页部署在 https://<user>.github.io/<repo>/ 子路径下
 */
const isStaticExport = process.env.STATIC_EXPORT === '1'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export' as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath } : {}),
  /**
   * 把 Payload 系列包外部化为运行时 require，不参与打包：
   * - 避免 drizzle-kit/libsql 的 CJS 资产破坏 Turbopack/Turbopack 静态导出构建
   * - 静态模式下这些代码路径不会执行，仅存在于服务端依赖图
   */
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-sqlite',
    '@payloadcms/drizzle',
    '@payloadcms/next',
    '@payloadcms/richtext-lexical',
    '@libsql/client',
    'sharp',
  ],
  images: isStaticExport
    ? { unoptimized: true }
    : {
        localPatterns: [
          {
            pathname: '/api/media/file/**',
          },
        ],
      },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default isStaticExport ? nextConfig : withPayload(nextConfig)
