const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.removeTour = (req, res) => {
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
