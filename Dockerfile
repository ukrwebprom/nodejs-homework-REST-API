FROM node

WORKDIR /homework-restapi

COPY . .

RUN npm install

EXPOSE 3000

CMD ['node', 'server.js']