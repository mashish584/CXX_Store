const { validationResult } = require('express-validator/check');

// Import validators
let { validateProductForm } = require('./validators/validateProduct');
let { validateSignUpForm } = require('./validators/validateSignUp');
let { validateSignInForm } = require('./validators/validateSignIn');
let { validateResetForm } = require('./validators/validateReset');
let { validateCategoryForm } = require('./validators/validateCategory');

// Validation Error Catcher
exports.validateErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  next();
};

//Export all validators
exports.validateProductForm = validateProductForm;
exports.validateSignUpForm = validateSignUpForm;
exports.validateSignInForm = validateSignInForm;
exports.validateResetForm = validateResetForm;
exports.validateCategoryForm = validateCategoryForm;
