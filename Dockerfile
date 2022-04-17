FROM node:12.18.2-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY npm.lock .

RUN npm install

COPY . .
RUN npm run build

FROM node:12.18.2-alpine

RUN apk add poppler-utils

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY  --from=builder /usr/src/app/package.json ./package.json
COPY  --from=builder /usr/src/app/node_modules ./node_modules
COPY  --from=builder /usr/src/app/templates ./templates
COPY  --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js"]
