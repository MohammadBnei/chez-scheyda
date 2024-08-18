# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:22-slim AS base
WORKDIR /usr/src/app

RUN npm install -g bun

# full image because bun and node-gyp error
FROM node:22 AS install

RUN npm i -g bun

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build:server

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist .
COPY --from=prerelease /usr/src/app/package.json .

COPY medusa-config.js .

ARG NODE_ENV
ARG PORT

ENV NODE_ENV=production
ENV PORT=3000

ARG DATABASE_TYPE
ARG MEDUSA_ADMIN_ONBOARDING_TYPE
ARG STORE_CORS
ARG MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY
ARG LOCALE
ARG STRIPE_API_KEY
ARG DATABASE_URL

CMD ["bun", "start"]
