const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.searchProducts = async (req, res, next) => {
  let { q } = req.query;
  let products = await Product.aggregate([
    {
      $match: {
        $or: [
          { productTitle: { $regex: new RegExp(`^${q}`, 'i') } },
          { productP_cat: { $regex: new RegExp(`^${q}`, 'i') } },
          { productC_cat: { $regex: new RegExp(`^${q}`, 'i') } },
        ],
      },
    },
    {
      $project: {
        title: '$$ROOT.productTitle',
      },
    },
  ]);
  //@return search result
  return res.status(200).json({ products });
};
