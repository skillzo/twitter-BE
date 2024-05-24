FROM  node:17
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "build/index.js"]