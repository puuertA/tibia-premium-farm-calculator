FROM node:20-slim

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/prisma ./prisma
RUN npx prisma generate

COPY server ./
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
