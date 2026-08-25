# syntax=docker/dockerfile:1

# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=optional

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建参数
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 创建数据目录（SQLite 数据库 + 媒体文件）
RUN mkdir -p /app/data /app/media \
  && chown -R nextjs:nodejs /app/data /app/media

# 设置数据卷
VOLUME ["/app/data", "/app/media"]

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
