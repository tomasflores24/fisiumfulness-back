const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController.js');

const router = Router();

router.post('/create', createBlog);
router.get('/', getAllBlog);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', updateBlog);
router.delete('/delete/:id', deleteBlog);

module.exports = router;
