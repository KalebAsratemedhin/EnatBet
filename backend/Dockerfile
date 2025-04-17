FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node config/seeder.js && node server.js"]