FROM node:16-buster-slim AS builder
ADD . /app
WORKDIR /app
RUN apt-get update && apt-get install -y \
    git \
    autoconf \
    automake \
    g++ \
    libpng-dev \
    make\
    nasm
RUN yarn install --frozen-lockfile
RUN npx update-browserslist-db@latest
RUN yarn build

FROM node:16-buster-slim
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]
