const { Prisma } = require('@prisma/client');
const { prisma } = require('../prisma');
const { entrySchema, updateEntrySchema } = require('../validators/entrySchema');
const { ZodError } = require('zod');

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw Object.assign(new Error('Invalid entry id'), { status: 400 });
  }
  return id;
}

function handleError(error, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Entry not found' });
    }
  }

  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  return next(error);
}

async function createEntry(req, res, next) {
  try {
    const data = entrySchema.parse(req.body);
    const entry = await prisma.entry.create({ data });
    return res.status(201).json(entry);
  } catch (error) {
    return handleError(error, res, next);
  }
}

async function listEntries(req, res, next) {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    const search = req.query.search ? String(req.query.search).trim().toLowerCase() : undefined;

    const skip = (page - 1) * limit;

    let entries;
    let total;

    if (search) {
      const allEntries = await prisma.entry.findMany({ orderBy: { createdAt: 'desc' } });
      const filtered = allEntries.filter((entry) =>
        entry.title.toLowerCase().includes(search)
      );
      total = filtered.length;
      entries = filtered.slice(skip, skip + limit);
    } else {
      [entries, total] = await Promise.all([
        prisma.entry.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.entry.count(),
      ]);
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.json({
      data: entries,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return handleError(error, res, next);
  }
}

async function updateEntry(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const data = updateEntrySchema.parse(req.body);
    const entry = await prisma.entry.update({ where: { id }, data });
    return res.json(entry);
  } catch (error) {
    return handleError(error, res, next);
  }
}

async function deleteEntry(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await prisma.entry.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return handleError(error, res, next);
  }
}

module.exports = {
  createEntry,
  listEntries,
  updateEntry,
  deleteEntry,
};
