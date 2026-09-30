/**
 * 站点内容配置 —— 个人信息的唯一来源（SSOT）
 *
 * 部署到 Vercel 后即使没有数据库，页面也能完整渲染这些默认内容。
 * 修改后 git push 即自动重新部署。
 */

export const site = {
  name: 'Chunfei',
  handle: 'Chun556699',
  role: 'AI 工程师 · 全栈开发者',
  tagline: '把复杂系统做清楚，把技术变成可用的产品',
  description:
    '专注于 AI 应用工程与全栈产品化——从 RAG、模型网关到桌面工具，关注的不只是模型能力，还有可靠性、交互与真正可用的交付。',
  email: 'chun556699@gmail.com',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://chun556699.github.io/personal-homepage',
  socials: {
    github: 'https://github.com/Chun556699',
    twitter: 'https://x.com/isokchun',
    blog: 'https://www.mychun.cn',
  },
  /** 是否显示“可接受新机会”徽章 */
  availableForWork: true,
} as const

export const skills = [
  'TypeScript',
  'Python',
  'React',
  'Next.js',
  'FastAPI',
  'Electron',
  'Tailwind CSS',
  'PyTorch',
  'Docker',
  'RAG / LLM 应用',
] as const

export type Project = {
  name: string
  description: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    name: '闪念录屏 Flash Recorder',
    description: '「点击即聚焦」的丝滑局部放大录屏工具：鼠标为中心平滑放大 2x/3x/5x，多录制源、光标特效、MP4 导出。',
    tags: ['Electron', '桌面工具', '录屏'],
    href: 'https://github.com/Chun556699/Flash-Recorder',
  },
  {
    name: 'RAG KnowledgeBase',
    description: '检索增强知识库问答系统：向量检索 + LLM 问答，面向实际可用的 AI 知识检索工作流。',
    tags: ['Python', 'RAG', 'LLM'],
    href: 'https://github.com/Chun556699/RAG-KnowledgeBase',
  },
  {
    name: 'AI Gateway',
    description: '一个 key 聚合多家 AI 服务的中转网关，统一入口管理模型调用。',
    tags: ['FastAPI', 'LLM', '网关'],
    href: 'https://github.com/Chun556699/ai-Integration',
  },
  {
    name: 'Transformer 并行翻译',
    description: '基于 Transformer 架构的多语言翻译系统，覆盖从模型训练到部署的完整链路。',
    tags: ['PyTorch', 'NLP', 'Transformer'],
    href: 'https://github.com/Chun556699/Transformer-parallel-translation',
  },
  {
    name: 'AI 简历编辑器',
    description: '所见即所得的简历编辑器，集成 AI 润色与一键 PDF 导出。',
    tags: ['Next.js', 'AI', '产品'],
    href: 'https://github.com/Chun556699/resume-builder',
  },
  {
    name: '本站 · 个人主页',
    description: '极简高性能个人站：静态优先渲染、Payload CMS 写作后台、深浅色主题与全套 SEO。',
    tags: ['Next.js 16', 'Payload CMS', 'Tailwind 4'],
    href: 'https://github.com/Chun556699/personal-homepage',
  },
]
