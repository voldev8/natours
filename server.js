const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('db connection successful!'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // validator
    unique: true
  },
  rating: Number,
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The Park',
  rating: 4.2
});

testTour.save();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
