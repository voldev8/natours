const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

/// 1)middlewares

// security HTTP headers
app.use(helmet());
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same IP
const limiter = rateLimit({
  //100 limits in on hour limit from an IP
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// body parser, reading data from body into req.body
app.use(express.json());

// skipping these two
// data sanitization against NoSQL query injection
// data sanitization against XSS

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// serving static files
app.use(express.static(`${__dirname}/public`));
// test middleware
app.use((req, res, next) => {
  //add current time to request
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

/// 2)routeHandlers
//moved to another file

/// 3)Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// global error handler
app.use(globalErrorHandler);

/// 4)Server
//moved to another file

module.exports = app;
