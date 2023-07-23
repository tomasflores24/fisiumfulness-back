const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  updateBlog,
  statusBlog,
} = require('../controllers/blogController.js');
const { upload } = require('../config/multerConfig.js');
const authAll = require('../middleware/authAll');
const router = Router();

router.post('/create', upload, createBlog);
router.get('/', getAllBlog);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', upload, updateBlog);
router.patch('/status/:id', statusBlog);

module.exports = router;
