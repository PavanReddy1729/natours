const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique : true,
      maxlength : [40, 'A tour name must have less or equal than 40 characters'],
      minlength : [10, 'A tour must have more or equal than 10 characters'],
      //validate : [validator.isAlpha , 'Tour name must contain characters']
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum : {
        values : ['easy', 'medium', 'difficult'],
        message : 'Difficulty is either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min : [1, 'Rating must be above 1.0'],
      max : [5, 'Rating must be below 5.0'],
      set : val => Math.round(val * 10) /10 //4.66666, 46.6666, 47,4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscounts: {
      type : Number,
      validate :{
        validator : function(val){
          return val< this.price;
        },
        message : 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation : {
      //GetJSON
      type : {
        type : String,
        default : 'Point',
        enum : ['Point']
      },
      coordinates : [Number],
      address : String,
      description : String
    },
    locations : [
      {
        type : {
          type : String,
          default : 'point',
          enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String,
        day : Number
      }
    ],
    guides : [
      {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price : 1, ratingsAverage : -1});
tourSchema.index({ slug : 1 });
tourSchema.index({ startLocation : '2dsphere'});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref : 'review',
  foreignField : 'tour',
  localField : '_id'
});

// DOCUMENT MIDDLEWARE : runs before .save() and .create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next){
//   const guidePromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
// })

// tourSchema.pre('save', function(next){
//   console.log('will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });

tourSchema.pre('/^find/', function (next) {
  this.populate({
    path : 'guides',
    select : '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
