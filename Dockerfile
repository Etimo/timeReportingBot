FROM node:9.0-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn run compile

ENTRYPOINT ["node"]