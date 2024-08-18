FROM node:14

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install --only=development --silent

CMD ["npx", "ts-node-dev", "--respawn", "--poll", "--files", "index.dev.ts"]
