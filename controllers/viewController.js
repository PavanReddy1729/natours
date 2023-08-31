const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();
  // 2) Build Template
  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res) => {
  // 1) Get the data from the requested tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .populate('guides');

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build Template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
});

exports.getSignUpForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title : 'Create an account'
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new : true,
      runValidators : true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user : updatedUser
  });
 
});
