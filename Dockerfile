FROM node:20-alpine

WORKDIR /ce_equipment_history

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]