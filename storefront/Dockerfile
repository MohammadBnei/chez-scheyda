FROM node:22-slim AS base
WORKDIR /usr/src/app
RUN npm install -g bun


FROM node:22 AS installer
WORKDIR /temp/prod
RUN npm i -g bun
COPY package.json bun.lockb /temp/prod/
RUN bun install --frozen-lockfile 


FROM base AS builder
WORKDIR /app
COPY --from=installer /temp/prod/ ./ 
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ARG BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${BASE_URL}
RUN bun run build 

FROM base AS runner
WORKDIR /app
COPY --from=installer /temp/prod/node_modules node_modules
COPY --from=builder /app/.next ./.next
COPY next.config.js store.config.json store-config.js ./
EXPOSE 8000
CMD ["bun", "run", "start"]