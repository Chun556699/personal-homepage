import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'admin',
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
