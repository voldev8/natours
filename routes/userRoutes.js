const express = require('express');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo
} = require('../controllers/authController');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  removeUser,
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updatePassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(removeUser);

module.exports = router;
