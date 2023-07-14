const { Router } = require('express');
const {
  createUser,
  getUser,
  getDetail,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { upload } = require('../config/multerConfig');

const router = Router();

router.post('/create', upload, createUser);
router.get('/', getUser);
router.get('/detail/:id', getDetail);
router.put('/update/:id', upload, updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
