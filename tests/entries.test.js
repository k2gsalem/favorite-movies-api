const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/prisma');
const { sampleEntries } = require('./fixtures');

describe('Favorite entries API', () => {
  test('lists entries with pagination metadata', async () => {
    const response = await request(app).get('/api/entries').expect(200);

    expect(response.body.data).toHaveLength(sampleEntries.length);
    expect(response.body.meta).toMatchObject({
      total: sampleEntries.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  test('paginates entries when limit is provided', async () => {
    const response = await request(app).get('/api/entries?limit=2&page=2').expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toMatchObject({
      total: sampleEntries.length,
      page: 2,
      limit: 2,
      totalPages: 2,
    });
  });

  test('filters entries by search term', async () => {
    const response = await request(app).get('/api/entries?search=grand').expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('The Grand Budapest Hotel');
  });

  test('creates a new entry when payload is valid', async () => {
    const payload = {
      title: 'The Matrix',
      type: 'MOVIE',
      director: 'The Wachowskis',
      budget: 63000000,
      location: 'Sydney, Australia',
      duration: 136,
      yearOrTime: '1999',
    };

    const response = await request(app).post('/api/entries').send(payload).expect(201);

    expect(response.body).toMatchObject(payload);

    const entries = await prisma.entry.findMany();
    expect(entries).toHaveLength(sampleEntries.length + 1);
  });

  test('fails to create a new entry when payload is invalid', async () => {
    const payload = {
      type: 'MOVIE',
      director: 'Unknown',
      budget: 'not-a-number',
      location: 'Somewhere',
      duration: 100,
      yearOrTime: '2024',
    };

    const response = await request(app).post('/api/entries').send(payload).expect(400);

    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'title' }),
        expect.objectContaining({ path: 'budget' }),
      ])
    );
  });

  test('updates an existing entry', async () => {
    const existing = await prisma.entry.findFirst({
      where: { title: sampleEntries[0].title },
    });

    const response = await request(app)
      .put(`/api/entries/${existing.id}`)
      .send({ director: 'Updated Director' })
      .expect(200);

    expect(response.body.director).toBe('Updated Director');
  });

  test('returns 404 when updating an entry that does not exist', async () => {
    const response = await request(app)
      .put('/api/entries/9999')
      .send({ title: 'Missing' })
      .expect(404);

    expect(response.body.message).toBe('Entry not found');
  });

  test('deletes an entry by id', async () => {
    const existing = await prisma.entry.findFirst();

    await request(app).delete(`/api/entries/${existing.id}`).expect(204);

    const entry = await prisma.entry.findUnique({ where: { id: existing.id } });
    expect(entry).toBeNull();
  });
});
