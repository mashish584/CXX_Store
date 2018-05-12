const express = require('express');
const router = express.Router();

const { catchAsyncError } = require('../handlers/errorHandler');

const {
  validateResetForm,
  validateErrors,
} = require('../middlewares/validateData');

const {
  getAllCounts,
  activateAccount,
  setForgotToken,
  accessReset,
  resetPassword,
} = require('../controllers/accountController');

/*============================
    ACCOUNT - GET ROUTES
==============================*/

router.get('/all/counts',catchAsyncError(getAllCounts));

router.get('/reset/:token', catchAsyncError(accessReset));

/*============================
    ACCOUNT - PUT ROUTES
==============================*/

router.put('/activate/:token', catchAsyncError(activateAccount));
router.put('/forgot/:email', catchAsyncError(setForgotToken));
router.put(
  '/reset/:token',
  validateResetForm,
  validateErrors,
  catchAsyncError(resetPassword)
);

module.exports = router;
