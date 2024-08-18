FROM node:14

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install --only=development --silent

CMD npm run swagger-autogen && npx ts-node-dev --respawn --poll --files index.dev.ts
