FROM node:17.1-alpine3.12

LABEL version="1.0" description="node image"

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "start"]