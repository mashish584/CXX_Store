const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

exports.validateCategoryForm = [
  check('name', 'Catgory is required')
    .trim()
    .isLength({ min: 1 }),
  check('type', 'Type of category is required.')
    .trim()
    .isLength({ min: 1 }),
  check('parent').trim(),
  sanitize('name'),
  sanitize('type'),
  sanitize('parent'),
];
