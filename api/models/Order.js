const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const OrderSchema = mongoose.Schema({
  payment_id: String,
  user: String,
  cart: [],
  amount: Number,
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Order', OrderSchema);
