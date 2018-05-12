const mongoose = require('mongoose');
const Order = mongoose.model('Order');

/*=============================
        GET CONTROLLER
===============================*/

exports.getAllOrders = async (req, res, next) => {
  const orders = await Order.find({});
  return res.status(200).json({ message: 'All orders fetched', orders });
};
