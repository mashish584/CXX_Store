const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Category name is required.',
  },
  type: {
    type: String,
    trim: true,
    default: 'Parent',
  },
  parent: String,
  childs: [],
});

module.exports = mongoose.model('Category', CategorySchema);
