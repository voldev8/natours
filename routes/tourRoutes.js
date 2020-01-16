const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  removeTour
} = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(removeTour);

module.exports = router;
