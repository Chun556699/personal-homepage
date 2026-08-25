/**
 * 站点内容配置 —— 个人信息的唯一来源（SSOT）
 *
 * 部署到 Vercel 后即使没有数据库，页面也能完整渲染这些默认内容。
 * 修改后 git push 即自动重新部署。
 */

export const site = {
  name: 'Chun',
  handle: 'Chun556699',
  role: '全栈开发者 · 设计工程师',
  tagline: '构建快速、优雅的数字产品',
  description:
    '热爱技术，追求美学。在这里记录我的思考、项目和成长，用代码创造简洁而优雅的体验。',
  email: 'hello@example.com', // TODO: 改为你的邮箱
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.vercel.app',
  socials: {
    github: 'https://github.com/Chun556699',
    twitter: 'https://x.com/', // TODO: 改为你的 X/Twitter 主页
  },
  /** 是否显示“可接受新机会”徽章 */
  availableForWork: true,
} as const

export const skills = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Tailwind CSS',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Python',
  'AI/LLM 应用',
] as const

export type Project = {
  name: string
  description: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    name: 'AI 简历编辑器',
    description: '所见即所得的简历编辑器，集成 AI 润色与一键 PDF 导出。',
    tags: ['Next.js', 'AI', '产品'],
    href: 'https://github.com/Chun556699',
  },
  {
    name: 'AI 助手平台',
    description: '基于大语言模型的对话系统，支持多轮对话、工具调用与 RAG 检索增强。',
    tags: ['LLM', 'RAG', 'Node.js'],
  },
  {
    name: '数据可视化平台',
    description: '实时监控仪表盘，支持自定义图表、阈值告警与大屏展示。',
    tags: ['React', 'WebSocket'],
  },
  {
    name: '设计系统',
    description: '企业级组件库，50+ 高质量组件，覆盖主题定制与无障碍访问。',
    tags: ['组件库', '设计工程'],
  },
  {
    name: 'API 网关',
    description: '微服务统一入口，限流、鉴权、日志一体化，支撑日均百万请求。',
    tags: ['Node.js', '架构'],
  },
  {
    name: 'DevOps 工具链',
    description: 'CI/CD 自动化流水线，从提交到上线一键完成。',
    tags: ['Docker', '自动化'],
  },
]
