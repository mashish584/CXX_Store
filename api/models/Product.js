const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema(
  {
    productTitle: {
      type: String,
      trim: true,
      required: 'Please enter Product title',
    },
    productQty: {
      type: Number,
      min: 1,
    },
    productPrice: Number,
    productP_cat: {
      type: String,
      trim: true,
      required: 'Please Select parent Category',
    },
    productC_cat: {
      type: String,
      trim: true,
      required: 'Please Select parent Category',
    },
    product_desc: {
      type: String,
      trim: true,
      min: 75,
      required: 'Please add product Description',
    },
    productFeatures: {
      type: Object,
      required: true,
    },
    productImg: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

//return the averageRating of selected product
productSchema.statics.getAverageRating = function(reviews) {
  let ids = reviews.map(review => mongoose.Types.ObjectId(review.product));
  return this.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews',
      },
    },
    {
      $match: {
        _id: { $in: ids },
      },
    },
    {
      $project: {
        _id: 0,
        average: { $avg: '$reviews.rating' },
      },
    },
  ]);
};

function populate(next) {
  this.populate('reviews');
  next();
}

productSchema.pre('find', populate);
productSchema.pre('findOne', populate);


module.exports = mongoose.model('Product', productSchema);
