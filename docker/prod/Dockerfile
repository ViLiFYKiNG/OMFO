# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine as builder


WORKDIR /app


COPY package*.json ./


RUN npm ci


COPY . .


RUN npm run build




FROM node:${NODE_VERSION}-alpine as production


ENV NODE_ENV=production


WORKDIR /app


COPY package*.json ./


RUN npm ci --ignore-scripts


COPY --from=builder /app/dist ./


EXPOSE 5500


CMD ["node", "src/server.js"]








