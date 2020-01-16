const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

// 1)middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  //add current time to request
  req.requestTime = new Date().toISOString();
  next();
});

// 2)routeHandlers
//moved to another file

// 3)Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4)Server
//moved to another file
module.exports = app;
