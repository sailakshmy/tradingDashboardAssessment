FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/client/package.json ./apps/client/package.json

RUN npm install

COPY apps/client ./apps/client

RUN npm run build --workspace client

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/apps/client/dist ./dist

RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]

