FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]