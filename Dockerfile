FROM node:16.17.1-alpine3.15 AS server

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]