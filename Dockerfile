FROM node:alpine
RUN npm install -g @11ty/eleventy@2.0.1

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
COPY .env.docker .env

CMD ["npm", "run", "watch:eleventy"]
