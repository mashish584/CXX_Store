const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Order = mongoose.model('Order');


/*=============================
        GET CONTROLLER
===============================*/

exports.getProducts = async (req, res, next) => {
  let products = await Product.find({});
  return res.status(200).json({ message: 'All products fetched.', products});
};

exports.getProductById = async (req, res, next) => {
  let product = await Product.findById({ _id: req.params.id });
  let averageRating = await Product.getAverageRating(product.reviews);
  return res.status(200).json({ message: 'Single product fetched.', product,averageRating});
};

exports.getRandomProducts = async(req,res,next) => {
  const {id} = req.params;
  let products = await Product.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews',
      },
    },
     {
      $sample:{size:parseInt(id,10)}
     },
     {
       $addFields:{
         average: {$avg:'$reviews.rating'}
       }
     }
  ]);
  return res.status(200).json({message:`${id} products fetched`,products});
};

exports.getProductsByCategory = async(req,res,next) => {
  const {name} = req.params;
  // send Products with average Ratings
  let products = await Product.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews',
      },
    },
     {
      $match:{productP_cat:{$regex : new RegExp(name, "i") }}
     },
     {
       $addFields:{
         average: {$avg:'$reviews.rating'}
       }
     }
  ]);
  return res.status(200).json({message:`Products fetched for ${name}`,products});
};

exports.getProductsBySubCategory = async(req,res,next) => {
  const {name} = req.params;
  // send products with average Ratings
  let products = await Product.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews',
      },
    },
     {
      $match:{productC_cat:{$regex : new RegExp(name, "i") }}
     },
     {
       $addFields:{
         average: {$avg:'$reviews.rating'}
       }
     }
  ]);
  return res.status(200).json({message:`Products fetched for ${name}`,products});
};

exports.getCategories = async (req, res, next) => {
  let categories = await Category.find({});
  //@return 200 status and set all categories in response
  return res.status(200).json({ categories });
};

exports.getCategoriesByType = async (req, res, next) => {
  const { type } = req.params;
  let categories = await Category.find({ type });
  //@return 200 status and all categories in response
  return res.status(200).json({ categories });
};

exports.getCategoriesByParent = async (req, res, next) => {
  const { parent } = req.params;
  let categories = await Category.find({ parent });
  console.log(parent);
  //@return 200 status and all categories in reponse
  return res.status(200).json({ categories });
};

/*=============================
        POST CONTROLLER
===============================*/

/*
  >=> Add Product in database
  >=> if all fields are valid
*/

exports.addProduct = async (req, res, next) => {
  await new Product(req.body).save();
  //@return 200 response to client
  return res.status(200).json({ message: 'Product successfully added in database.' });
};

/*
  >=> Adding Category in database
  >=> if all fields are valid
*/

exports.addCategory = async (req, res, next) => {
  // get type of category and
  // child field from body
  let { type, parent } = req.body;

  // @return 422 response if type if child
  // and parent field is empty
  if (type.toLowerCase() === 'child') {
    if (!parent)
      return res
        .status(422)
        .json({ message: 'Please enter parent category name.' });
  }

  //Save category
  let category = await new Category(req.body).save();
  //@return 200 response to client
  return res
    .status(200)
    .json({ message: ' Category successfully added in databse', category });
};


/*
  >=> Create Charges with stripe
  >=> for the coming token
*/

exports.checkout = async(req,res,next) => {

    const stripe = require('stripe')(process.env.stripe_key);
    let {token,cart,email} = req.body;


    let charge = await stripe.charges.create({
      amount: cart.total*100,
      currency: 'usd',
      description: `Payment of $${cart.total} against the purchase of ${cart.count} products made by ${email}`,
      source: token.id,
    });

    let order = await new Order({
      payment_id:charge.id,
      user:email,
      cart,
      amount:charge.amount,
    }).save();

    // reduce the product quantity
    await cart.items.map(async(item) => {
        await Product.findOneAndUpdate({_id:item.id},{$inc:{productQty:-item.qty}}).exec();
    });

    return res.status(200).json({message:`Payment of $${cart.total} successfully made against your purchase.`,order});
};

/*=============================
        PUT CONTROLLER
===============================*/

exports.updateProductById = async (req, res, next) => {
  let product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  return res.status(200).json({ message: 'Product Updated', product });
};

exports.updateProductImage = async (req, res, next) => {
  const { productImg } = req.body;
  let product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    { productImg }
  ).exec();
  product.productImg = productImg;
  return res.status(200).json({message:'Product Image Updated',product});
};

/*=============================
      DELETE CONTROLLER
===============================*/

exports.removeProductById = async (req, res, next) => {
  let product = await Product.findOneAndRemove({ _id: req.params.id });
  return res.status(200).json({message:"One Product Removed"});
};
