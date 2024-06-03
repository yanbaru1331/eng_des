FROM node:22-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends sudo man lsof && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "node   ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


WORKDIR /usr/src/back

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Corepackを有効化
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json ./

RUN pnpm install -g typescript ts-node

# COPY --chown=node:node . .

EXPOSE 3000

USER node

WORKDIR /usr/src/back