FROM node:18-alpine

# Outils de compilation nécessaires pour bcrypt (node-gyp)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
