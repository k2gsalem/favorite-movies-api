const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { sampleEntries } = require('./fixtures');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';

const testDbFile = path.join(__dirname, '..', 'test.db');
const testDbJournalFile = `${testDbFile}-journal`;

beforeAll(() => {
  if (fs.existsSync(testDbFile)) {
    fs.unlinkSync(testDbFile);
  }
  if (fs.existsSync(testDbJournalFile)) {
    fs.unlinkSync(testDbJournalFile);
  }
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

// Require prisma after migrations have been applied and env vars set
const { prisma } = require('../src/prisma');

beforeEach(async () => {
  await prisma.entry.deleteMany();
  await prisma.entry.createMany({ data: sampleEntries });
});

afterAll(async () => {
  await prisma.$disconnect();
  if (fs.existsSync(testDbFile)) {
    fs.unlinkSync(testDbFile);
  }
  if (fs.existsSync(testDbJournalFile)) {
    fs.unlinkSync(testDbJournalFile);
  }
});
