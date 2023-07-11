const { Router } = require('express');
const { createComment, getComment } = require('../controllers/commentController');

const router = Router();

router.post('/create', createComment);
router.get('/', getComment);

module.exports = router;
