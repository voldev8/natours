const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than 40 characters'],
      minlength: [5, 'A tour name must have more than 5 characters']
      // validate: [validator.isAlpha, 'Must be only characters'] //'spaces ruins this one'
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    rating: Number,
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // geoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], // we expect an arrays of numbers
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number], // we expect an arrays of numbers
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// virtuals are not saved on database
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  //in reviewModel tourModel is saved as tour
  foreignField: 'tour',
  // this is what it is called and how we connect local and foreign
  localField: '_id'
});

// document middleware, 'save' 'create'
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// embedding any update at guide will needed to be checked by User
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// query middleware
tourSchema.pre(/^find/, function(next) {
  // tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(docs);
//   next();
// })

// aggregation middleware
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   // console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
