const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// this has to be on top so it can catch errors
process.on('uncaughtException', err => {
  console.log('Unhandled exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('db connection successful!'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(err);
  server.close(() => {
    // 1 stands for uncaught exception, 0 is for success
    process.exit(1);
  });
});

// this is for uncaught exception
// console.log(x);
