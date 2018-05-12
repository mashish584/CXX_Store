const { check } = require('express-validator/check');

exports.validateSignInForm = [
  check('email', 'Email and Password Combination not matched.')
    .trim()
    .isEmail()
    .isLength({ min: 1 }),

  check('password', 'Email and Password Combination not matched.').isLength({
    min: 1,
  }),
];
