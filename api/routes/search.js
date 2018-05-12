const express = require('express');
const router = express.Router();

const { catchAsyncError } = require('../handlers/errorHandler');
const { searchProducts } = require('../controllers/searchController');

router.get('', catchAsyncError(searchProducts));

module.exports = router;
