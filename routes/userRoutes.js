const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  removeUser
} = require('../controllers/userController');

const router = express.Router();

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
