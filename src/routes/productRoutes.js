const { Router } = require('express');
const {
  createProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware');

const router = Router();

router.post('/create', createProduct);
router.get('/', getAllProduct);
router.get('/detail/:id', getProductDetail);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
