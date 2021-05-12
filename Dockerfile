From  node:alpine

WORKDIR /app

COPY . .

RUN npm i

COPY server.js .

EXPOSE 3000

CMD  ["node", "server.js"]