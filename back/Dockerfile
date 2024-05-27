FROM node:22-alpine3.18
WORKDIR /usr/src/back

# Corepackを有効化
RUN corepack enable
COPY package*.json ./

COPY . .
EXPOSE 3000