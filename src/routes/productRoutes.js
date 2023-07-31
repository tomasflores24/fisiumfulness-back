const { Router } = require('express');
const {
  createProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
  statusProduct,
  deleteProduct,
  getProductRemodev
} = require('../controllers/productControllers');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware');
const authAll = require('../middleware/authAll');
const { upload } = require('../config/multerConfig');

const router = Router();

router.post('/create', adminAuthMiddleware, upload, createProduct);
router.get('/', getAllProduct);
router.get('/detail/:id', getProductDetail);
router.put('/update/:id', adminAuthMiddleware, upload, updateProduct);
router.patch('/status/:id', adminAuthMiddleware, statusProduct);
router.delete('/delete/:id', adminAuthMiddleware, deleteProduct);
router.get('/removed', getProductRemodev);

module.exports = router;
