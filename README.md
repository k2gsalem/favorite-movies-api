# Favorite Movies & TV Shows API

Simple REST API built with Node.js, Express, and Prisma to track favorite movies and TV shows. Validation uses Zod and data is stored in SQLite by default.

## Requirements

- Node.js 18+
- npm
- SQLite database referenced by `DATABASE_URL` (defaults to `file:./dev.db`)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env` to `.env.local` if you need local overrides, then adjust `DATABASE_URL`.
3. Prepare the database:
   ```bash
   npm run db:migrate
   npm run db:seed # optional sample data
   ```

## Run

- Development server: `npm run dev`
- Production build: `npm start`

The server listens on the `PORT` in `.env` (defaults to `3000`).

## API Reference

| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| GET    | `/health`          | Health check.                     |
| POST   | `/api/entries`     | Create a movie or TV show entry.  |
| GET    | `/api/entries`     | List entries with pagination.     |
| PUT    | `/api/entries/:id` | Replace an existing entry.        |
| DELETE | `/api/entries/:id` | Remove an entry.                  |

`GET /api/entries` accepts `page`, `limit`, and `search` (title filter). Responses include a `meta` block with pagination info.

## Prisma Client Troubleshooting

If the server logs `@prisma/client did not initialize yet`, run these commands from `c:\wamp64\www\favorite-movies-api`:

```bash
npm install @prisma/client prisma
npx prisma generate
npx prisma migrate dev   # or: npx prisma db push
```

Restart `npm run dev` after the commands succeed.

## Tests

```bash
npm test
```

Jest + Supertest spin up an isolated SQLite database for end-to-end checks.

## Project Structure

```
.
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.js
|-- src/
|   |-- app.js
|   |-- controllers/
|   |-- prisma.js
|   |-- routes/
|   `-- validators/
|-- tests/
`-- README.md
```
