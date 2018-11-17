FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get install python make g++ gcc node-typescript
RUN npm install

COPY . .

CMD [ "npm", "start" ]
