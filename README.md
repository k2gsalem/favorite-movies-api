# Favorite Movies & TV Shows API

A RESTful API built with Node.js, Express, and Prisma for managing favorite movies and TV shows. It supports creating, listing, updating, deleting, and searching entries with robust validation powered by Zod.

## Features

- Add new movies or TV shows with validation.
- List entries with pagination metadata (`page`, `limit`).
- Optional full-text search on titles via the `search` query parameter.
- Update and delete entries by ID.
- Prisma ORM models with migrations and seeding for sample data.
- Comprehensive Jest + Supertest test suite.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- npm

The project uses SQLite for local development and testing via Prisma. You can update the `DATABASE_URL` in the `.env` file to point to PostgreSQL or another supported database provider if desired.

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env` if you want to customise environment variables:

```bash
cp .env .env.local
```

Update `DATABASE_URL` in the `.env` file if needed. By default, it stores data in `dev.db` at the repository root.

### Database Setup

Run database migrations:

```bash
npm run db:migrate
```

Seed the database with sample movies and TV shows (two of each):

```bash
npm run db:seed
```

The seed data includes:

| Title                     | Type    | Director               | Year/Time      |
|---------------------------|---------|------------------------|----------------|
| Inception                 | Movie   | Christopher Nolan      | 2010           |
| The Grand Budapest Hotel  | Movie   | Wes Anderson           | 2014           |
| Stranger Things           | TV Show | The Duffer Brothers    | 2016-Present   |
| The Crown                 | TV Show | Peter Morgan           | 2016-2023      |

### Running the Server

```bash
npm start
```

The API listens on the port defined in `.env` (defaults to `3000`).

### API Endpoints

| Method | Endpoint                | Description                              |
|--------|-------------------------|------------------------------------------|
| GET    | `/health`               | Health check endpoint.                   |
| POST   | `/api/entries`          | Create a new movie or TV show entry.     |
| GET    | `/api/entries`          | List entries with pagination & search.   |
| PUT    | `/api/entries/:id`      | Update an existing entry by ID.          |
| DELETE | `/api/entries/:id`      | Delete an entry by ID.                   |

#### Listing Entries

Query parameters:

- `page` (default `1`) – page number (1-indexed).
- `limit` (default `10`) – number of entries per page.
- `search` (optional) – case-insensitive title filter.

The response includes a `meta` object with pagination details.

### Running Tests

```bash
npm test
```

The test suite spins up an isolated SQLite database, applies migrations, seeds fixtures, and exercises all API endpoints.

## Project Structure

```
├── prisma
│   ├── migrations/         # Prisma migration history
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed script with sample entries
├── src
│   ├── app.js              # Express application setup
│   ├── controllers/        # Route handlers
│   ├── prisma.js           # Prisma client instance
│   ├── routes/             # API route definitions
│   └── validators/         # Zod schemas
├── tests                   # Jest + Supertest integration tests
└── README.md
```

## Additional Notes

- The project defaults to SQLite for ease of setup. To use PostgreSQL, update `provider` in `prisma/schema.prisma` and set `DATABASE_URL` accordingly, then rerun migrations.
- Prisma CLI emits a deprecation warning for defining the seed command in `package.json`. This project keeps the configuration for simplicity, but you can migrate to a `prisma.config.ts` file if preferred.
