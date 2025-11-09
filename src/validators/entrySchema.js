const { z } = require('zod');

const toNumber = (schema) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === '') {
      return value;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, schema);

const typeEnum = z.enum(['MOVIE', 'TV_SHOW']);

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: typeEnum,
  director: z.string().min(1, 'Director is required'),
  budget: toNumber(
    z
      .number({ invalid_type_error: 'Budget must be a number' })
      .int()
      .nonnegative('Budget cannot be negative')
  ),
  location: z.string().min(1, 'Location is required'),
  duration: toNumber(
    z
      .number({ invalid_type_error: 'Duration must be a number' })
      .int()
      .positive('Duration must be greater than 0')
  ),
  yearOrTime: z.string().min(1, 'Year or time is required'),
});

const updateEntrySchema = entrySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

module.exports = {
  entrySchema,
  updateEntrySchema,
};
