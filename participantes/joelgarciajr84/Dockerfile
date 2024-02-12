FROM node:16-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=local

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
