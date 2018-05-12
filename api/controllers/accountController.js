const mongoose = require("mongoose");
const User = mongoose.model("User");
const Product = mongoose.model("Product");
const Category = mongoose.model("Category");
const Order = mongoose.model("Order");

const { getToken, sendTokenToUser } = require("../handlers/tokenHandler");

/*===============================
       GET CONTROLLER
==================================*/

/*
  >=> getAll Count for Admin Tabs
*/

exports.getAllCounts = async (req, res, next) => {
    let users = await User.count({});
    let products = await Product.count({});
    let categories = await Category.count({});
    let orders = await Order.count({});
    return res.status(200).json({ users, products, categories, orders });
};

/*
  >=> Making a check to see if user
  >=> requested a page with valid token
  >=> if yes send access as true else false
*/

exports.accessReset = async (req, res, next) => {
    let { token } = req.params;
    let user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    let access = user ? true : false;
    //@return 200 response to client
    return res.status(200).json({ access });
};

/*===============================
       PUT CONTROLLER
==================================*/

/*
  >=> Activate user account if
  >=> resetToken is valid and not expired
*/

exports.activateAccount = async (req, res, next) => {
    //get token
    const { token } = req.params;

    // find user with token
    // if valid reset token and change status
    let user = await User.findOneAndUpdate(
        {
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        },
        { $set: { resetToken: null, resetTokenExpire: null, status: 1 } }
    );

    // @return 422 if token is invalid
    if (!user) return res.status(422).json({ message: "Token is not valid or expired." });

    //@return 200 response if token is valid
    return res.status(200).json({ message: "Account Activated." });
};

/*
  >=> Send the new reset link
  >=> with new genereated reset token
  >=> to user
*/

exports.setForgotToken = async (req, res, next) => {
    //get email
    const { email } = req.params;

    // create new reset token
    let [resetToken, resetTokenExpire] = [getToken, Date.now() + 60 * 60 * 1000];

    //set the updated token on user data
    let user = await User.findOneAndUpdate({ email }, { $set: { resetToken, resetTokenExpire } });

    if (user) {
        // send token if user is valid
        await sendTokenToUser(
            {
                host: req.hostname,
                resetToken,
                email,
                subject: "Password Reset"
            },
            false
        );
    }

    //@return 200 response to client
    return res.status(200).json({ message: "Password reset link has been send to you." });
};

/*
  >=> Update old password with
  >=> new user password and reset token and
  >=> expired date to null
*/

exports.resetPassword = async (req, res, next) => {
    // get token
    let { token } = req.params;
    // get password and confirm password from body
    let [password, confirm] = [req.body.password, req.body.confirm];

    //@return 422 if password and confirm password are not equal
    if (password != confirm) return res.status(422).json({ message: "Password not matched." });

    //resetToken and expire token date to null
    //if token is valid and not expired
    let user = await User.findOneAndUpdate(
        {
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        },
        { $set: { resetToken: null, resetTokenExpire: null, status: 1 } }
    );

    // @return 422 if user not found
    if (!user) return res.status(422).json({ message: "Invalid Token." });

    // update password and save it
    user.password = password;
    await user.save();

    // @return 200 response to client
    return res.status(200).json({ message: "Password reset successfully." });
};
