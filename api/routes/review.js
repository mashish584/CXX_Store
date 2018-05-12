const express = require('express');
const router = express.Router();

const { catchAsyncError } = require('../handlers/errorHandler');

const {
  getAllReviews,
  saveReview,
} = require('../controllers/reviewController');

/*=============================
        GET CONTROLLER
===============================*/

// get all reviews
router.get('', catchAsyncError(getAllReviews));

/*=============================
        POST CONTROLLER
===============================*/

// save user review
router.post('', catchAsyncError(saveReview));

module.exports = router;
