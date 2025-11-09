const { Router } = require('express');
const {
  createEntry,
  listEntries,
  updateEntry,
  deleteEntry,
} = require('../controllers/entryController');

const router = Router();

router.get('/', listEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
