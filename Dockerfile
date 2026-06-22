FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p uploads

EXPOSE 8001

CMD ["npm","run","start:prod"]
