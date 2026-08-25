import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  versions: {
    drafts: { autosave: { interval: 300 } },
  },
  access: {
    read: ({ req }) => {
      // 已登录管理员可读所有文章；未登录用户只能读已发布的
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: false },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'URL 路径，如 my-first-post' },
    },
    { name: 'excerpt', type: 'textarea', admin: { description: '文章摘要，显示在列表页' } },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'content', type: 'richText' },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: '留空则为草稿',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
