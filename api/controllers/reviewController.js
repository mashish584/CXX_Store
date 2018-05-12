const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

const {
  decodeJWT
} = require('../handlers/tokenHandler');

// get all reviews
exports.getAllReviews = async (req, res, next) => {
  let reviews = await Review.find({});
  return res.status(200).json({
    message: 'All Reviews Fetched',
    reviews
  });
};

// save user review
exports.saveReview = async (req, res, next) => {
  let token = req.headers.authorization;
  let user;

  if (token) {
    let {
      email
    } = decodeJWT(token);
    user = await User.findOne({
      email
    });
  }

  if (!user || !token)
    return res.status(400).json({
      message: 'Unauthorize access'
    });

  let count = await Review.count({
    product: req.body.product,
    user: user._id
  });

  if (count === 0) {
    req.body.user = user._id;
    let review = await new Review(req.body).save();
    return res.status(200).json({
      message: 'Your review for the product is submitted',
      review,
    });
  } else {
    return res.status(500).json({
      message: 'You already submitted your review for this product.',
    });
  }
};