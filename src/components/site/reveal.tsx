'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 轻量滚动渐显组件（~1KB，零依赖）。
 * 基于 IntersectionObserver + CSS 过渡，替代 framer-motion 方案；
 * 用户开启“减弱动态效果”时由 globals.css 直接跳过动画。
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  /** 延迟毫秒数，用于制造轻微的节奏感 */
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Component = Tag as React.ElementType

  return (
    <Component
      ref={ref}
      data-reveal=""
      data-visible={visible ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,transform] duration-700 ease-out data-[visible=false]:translate-y-4 data-[visible=false]:opacity-0 ${className}`}
    >
      {children}
    </Component>
  )
}
