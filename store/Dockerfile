# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:22-slim AS base
WORKDIR /usr/src/app

RUN npm install -g bun

# full image because bun and node-gyp error
FROM node:22 AS install

RUN npm i -g bun
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease-server
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build:server

FROM base AS prerelease-admin
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

ARG MEDUSA_BACKEND_URL

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build:admin


# copy production dependencies and source code into final image
FROM base AS release-server
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease-server /usr/src/app/dist .
COPY --from=prerelease-server /usr/src/app/package.json .

COPY medusa-config.js .

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "start"]

FROM nginx:alpine AS release-admin

RUN rm -rf /usr/share/nginx/html/*

COPY --from=prerelease-admin /usr/src/app/build /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]