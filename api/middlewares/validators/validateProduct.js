const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const mongoose = require('mongoose');
const User = mongoose.model('User');

//Cutom validator check for Number values
let IsValidNumber = value => String(value).match(/^[0-9]+$/);

// Product Form Validator
exports.validateProductForm = [
  check('productTitle')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Product title should be 10 characters long'),

  check('productQty')
    .trim()
    .isLength({ min: 1 })
    .withMessage("Product Quantity can't be empty")
    .custom(value => {
      //throw error if value is not valid
      if (!IsValidNumber(value)) {
        throw new Error('Product Quantity should be valid value');
      }
      return parseInt(value);
    }),

  check('productPrice')
    .trim()
    .isLength({ min: 1 })
    .withMessage("Product price can't be empty")
    .custom(value => {
      //throw error if value is not valid
      if (!IsValidNumber(value)) {
        throw new Error('Product Price should be valid number.');
      }
      return parseFloat(value);
    }),

  check('productP_cat')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please select parent category'),

  check('productC_cat')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please select child category'),

  check('product_desc')
    .trim()
    .isLength({ min: 75 })
    .withMessage('Product description should be 75 characters long'),

  check('productFeatures').custom(value => {
    // converting a given value back to JSON Object
    let features = JSON.parse(value);
    // throw error in case any key and value is missing
    Object.keys(features).map(type => {
      let f_Value = features[type];
      if (!f_Value || !type) throw new Error('Fill all the features field');
      return;
    });
    // @return value if all values are available
    return value;
  }),

  //sanitize all data
  sanitize('productTitle'),
  sanitize('productP_Cat'),
  sanitize('productC_cat'),
  sanitize('product_desc'),
];
