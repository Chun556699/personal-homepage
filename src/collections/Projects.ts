import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'order'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'href', type: 'text', admin: { description: '项目链接' } },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji 或 Lucide 图标名，如 🚀 或 Rocket' },
    },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
