FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Dummy values for build - Real values injected at runtime from Key Vault
ENV MONGODB_URI="mongodb://localhost:27017/?authSource=admin"
ENV MONGODB_DB="hawkyai"
ENV ELASTICSEARCH_CLOUD_ID="h-staging-ES:Y2VudHJhbGluZGlhLmF6dXJlLmVsYXN0aWMtY2xvdWQuY29tOjkyNDMkYjA5NWRmNDQ1OWQxNGUwMWI3MjMwMDU3ZjkwNTNhZTYkMmYzNjJkZTkyNWRjNDAzMGJiODU5NzFmNGFkZDA0ODQ="
ENV ELASTICSEARCH_API_KEY="ZHVtbXk6ZHVtbXk="
ENV ELASTICSEARCH_IMAGE_INDEX="image_competitors_analysis"
ENV ELASTICSEARCH_VIDEO_INDEX="video_competitors_analysis"
ENV AWS_ACCESS_KEY_ID="DUMMYACCESSKEY"
ENV AWS_SECRET_ACCESS_KEY="dummysecretkey"
ENV AWS_REGION="ap-south-1"
ENV AWS_S3_BUCKET="hawky-ai-static-tryout"
ENV GOOGLE_CLIENT_ID="dummy.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="dummy"
ENV NEXTAUTH_SECRET="dummysecret"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV RESEND_API_KEY="re_dummy"
ENV EMAIL_FROM="build@dummy.com"
ENV EMAIL_SERVER_HOST="smtp.example.com"
ENV EMAIL_SERVER_PORT="587"
ENV EMAIL_SERVER_USER="build@dummy.com"
ENV EMAIL_SERVER_PASSWORD="dummy"
ENV SLACK_ERROR_WEBHOOK_URL="https://hooks.slack.com/services/dummy"
ENV SLACK_WEBHOOK_URL="https://hooks.slack.com/services/dummy"
ENV VERCEL_OIDC_TOKEN="dummy"
ENV ZOHO_ACCESS_TOKEN="dummy"
ENV ZOHO_CLIENT_ID="dummy"
ENV ZOHO_CLIENT_SECRET="dummy"
ENV ZOHO_REFRESH_TOKEN="dummy"

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
