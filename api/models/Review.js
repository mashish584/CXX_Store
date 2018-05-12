const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

function populate(next) {
    this.populate("user").select("-password -resetToken -resetTokenExpire");
    next();
}

ReviewSchema.pre("find", populate);
ReviewSchema.pre("findOne", populate);

module.exports = mongoose.model("Review", ReviewSchema);
