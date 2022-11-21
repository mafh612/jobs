FROM node:16-alpine
USER root
ARG VERSION=development
ENV SHELL /bin/sh
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
ADD ./dist ./dist
ADD ./view ./view
ADD ./config ./config
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ENV NODE_ENV=production
RUN yarn install --production --frozen-lockfile --silent
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
