FROM node:9.2-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

ENTRYPOINT ["node", "index.js"]
