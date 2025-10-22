FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]