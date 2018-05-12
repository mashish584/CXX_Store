const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: 'Username is required',
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: 'Email is required',
    },
    password: {
      type: String,
      min: 7,
      required: 'Password should have a minimum length of 7 characters',
    },
    location: {
      type: {
        type: String,
        defauly: 'Point',
      },
      coordinates: [Number],
      address: String,
    },
    resetToken: String,
    resetTokenExpire: Date,
    role: {
      type: String,
      default: 'user',
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('orders', {
  ref: 'Order',
  localField: 'email',
  foreignField: 'user',
});

// function for populating user object
function populate(next) {
  this.populate('orders');
  next();
}

// pre hook for find and findOne for autoPopulate
userSchema.pre('find', populate);
userSchema.pre('findOne', populate);

// hash password before saving it into a database
userSchema.pre('save', function(next) {
  let user = this;
  let hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);
