FROM node:latest

ARG BOT_TOKEN
ARG API_SERVER_PORT

ENV NODE_ENV=production
ENV BOT_TOKEN=${BOT_TOKEN}
ENV API_SERVER_PORT=$API_SERVER_PORT

WORKDIR /usr/src/app

COPY package*.json ./

COPY src ./

RUN npm install --production

CMD ["node", "./index.js"]