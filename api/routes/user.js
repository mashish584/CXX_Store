const express = require('express');
const router = express.Router();

const { catchAsyncError } = require('../handlers/errorHandler');

/*===========================
     USER - CONTROLLERS
============================*/

const {
  getUsers,
  getUserDetails,
  signUp,
  signIn,
  deleteUser,
  verifyUser,
  getEmailOfUser,
} = require('../controllers/userController');

/*===========================
     USER - VALIDATORS
============================*/

const {
  validateSignUpForm,
  validateErrors,
} = require('../middlewares/validateData');

/*===========================
    USER - GET ROUTES
============================= */

// get all users
router.get('', catchAsyncError(getUsers));

// get user by id
router.get('/details', catchAsyncError(getUserDetails));

//check is current user is Admin
router.get('/verify', verifyUser);

/*===========================
    USER - POST ROUTES
============================= */

//register user into a site
router.post(
  '/signup',
  validateSignUpForm,
  validateErrors,
  catchAsyncError(signUp)
);

// authenticate user
router.post('/signin', catchAsyncError(signIn));

/*===========================
    USER - PUT ROUTES
============================= */

//update user detail
router.put('/:id/update', (req, res, next) => {});

/*===========================
    USER - DELETE ROUTES
============================= */

// delete user from a site
router.delete('/:id/delete', catchAsyncError(deleteUser));

module.exports = router;
