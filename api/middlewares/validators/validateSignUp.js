const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.validateSignUpForm = [
  check('email', 'Please enter valid email address')
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(async value => {
      let user = await User.findOne({ email: value });
      if (user) throw new Error('Email is already in records.');
      return value;
    }),

  check('username', 'Username must be 5 characters long')
    .trim()
    .isLength({ min: 5 }),

  check('password', 'Password must be 7 characters long and contain one number')
    .isLength({ min: 7 })
    .matches(/\d/),

  sanitize('username'),
];
