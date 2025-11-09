# syntax=docker/dockerfile:1
FROM node:20-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY prisma ./prisma
COPY src ./src
COPY .env.example ./

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && node src/server.js"]
