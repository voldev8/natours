const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  const newTour = Object.assign(tour, req.body);
  // tours[id] = newTour;
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    err => {
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tour
        }
      });
    }
  );
};

const removeTour = (req, res) => {
  const id = req.params.id * 1;
  const newTours = tours.filter(el => el.id !== id);
  if (!newTours)
    return res.status(404).json({ status: 'fail', message: 'invalid ID' });
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(newTours),
    err => {
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tour: newTours
        }
      });
    }
  );
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(removeTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
