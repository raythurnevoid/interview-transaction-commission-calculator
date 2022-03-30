FROM node:16.14.2
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start:dev"]