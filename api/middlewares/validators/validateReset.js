const { check } = require('express-validator/check');

exports.validateResetForm = [
  check('password', 'Password must be 7 characters long and contain one number')
    .isLength({ min: 7 })
    .matches(/\d/),
];
