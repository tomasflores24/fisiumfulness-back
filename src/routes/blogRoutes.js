const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController.js');
const { upload } = require('../config/multerConfig.js');

const router = Router();

router.post('/create', upload, createBlog);
router.get('/', getAllBlog);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', upload, updateBlog);
router.delete('/delete/:id', deleteBlog);

module.exports = router;
