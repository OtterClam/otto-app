FROM node:16-buster-slim AS builder

ENV NEXT_PUBLIC_DISCORD_CLIENT_ID

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
COPY --from=builder /app ./

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]
