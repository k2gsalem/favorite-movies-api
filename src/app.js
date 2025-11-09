const express = require('express');
const entriesRouter = require('./routes/entries');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/entries', entriesRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Fallback error handler
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
