const express = require('express');
const router = express.Router();

const { getAllOrders } = require('../controllers/orderController');
const { catchAsyncError } = require('../handlers/errorHandler');

/*============================
    ORDER - GET ROUTES
==============================*/

router.get('',catchAsyncError(getAllOrders));


module.exports = router;