import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/** 静态导出模式必需；内容仅取决于环境变量，两种模式下均可安全静态化 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
