# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and migrations and generate client
COPY prisma ./prisma
RUN npx prisma generate

FROM base AS test

# Copy source and test files for running the test suite
COPY src ./src
COPY tests ./tests
COPY jest.config.js ./
COPY .env.example ./

# Run the API test suite against a SQLite database to validate the build
ENV DATABASE_URL="file:./test.db"
RUN npm test

FROM base AS production

# Copy application source code and example environment file
COPY src ./src
COPY .env.example ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && node src/server.js"]
