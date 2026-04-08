FROM node:22-alpine AS base
WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/server/package.json ./apps/server/package.json

RUN npm install

COPY apps/server ./apps/server

RUN npm run build --workspace server

EXPOSE 4000

CMD ["npm", "run", "start", "--workspace", "server"]

