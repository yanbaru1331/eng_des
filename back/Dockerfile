FROM node:22-alpine3.18
WORKDIR /usr/src/back

# Corepackを有効化
RUN corepack enable
COPY package*.json ./
RUN npm install
RUN npm install express

COPY . .

RUN npx prisma generate

EXPOSE 3000