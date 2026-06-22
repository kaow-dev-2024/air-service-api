FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p uploads

EXPOSE 5001

CMD ["npm","run","start:prod"]
