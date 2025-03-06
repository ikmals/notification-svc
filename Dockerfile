FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .
#RUN npm run build
EXPOSE 3000

#CMD ["npm", "run", "start:prod"]
CMD ["npm", "run", "start:dev"]
