FROM node:latest

ARG API_SERVER_PORT
ARG BEARER_TOKEN

ENV NODE_ENV=production
ENV API_SERVER_PORT=$API_SERVER_PORT
ENV BEARER_TOKEN=$BEARER_TOKEN

WORKDIR /usr/src/app

COPY package*.json ./

COPY src ./

RUN npm install --production

EXPOSE $API_SERVER_PORT

CMD ["node", "./index.js"]
