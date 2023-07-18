const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  updateBlog,
  statusBlog,
  deleteBlog
} = require('../controllers/blogController.js');
const { upload } = require('../config/multerConfig.js');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware.js');

const router = Router();

router.post('/create', adminAuthMiddleware, upload, createBlog);
router.get('/', getAllBlog);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', adminAuthMiddleware, upload, updateBlog);
router.patch('/status/:id', adminAuthMiddleware, statusBlog);

router.delete('/delete/:id', adminAuthMiddleware, deleteBlog);

module.exports = router;
