import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Projects],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /**
   * 数据库（@payloadcms/db-sqlite 底层为 @libsql/client，一套适配器通吃三种场景）：
   * - 本地开发：file:./payload.db（默认，零依赖）
   * - Docker 自托管：file:/app/data/payload.db
   * - Vercel / Serverless：Turso 远程数据库
   *   设 DATABASE_URL=libsql://<name>-<org>.turso.io 与 DATABASE_AUTH_TOKEN 即可
   */
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
      ...(process.env.DATABASE_AUTH_TOKEN ? { authToken: process.env.DATABASE_AUTH_TOKEN } : {}),
    },
  }),
  sharp,
})
