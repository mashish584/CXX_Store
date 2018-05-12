const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

const { createJWT, decodeJWT, getToken, sendTokenToUser } = require("../handlers/tokenHandler");

/*=============================
      GET CONTROLLER
===============================*/

/*
  >=> Fetch all registersd users
*/

exports.getUsers = async (req, res, next) => {
    let users = await User.find({}).exec();
    return res.status(200).json({ message: "Users data successfully retreived", users });
};

/*
  >=> Fetch single user details
*/

exports.getUserDetails = async (req, res, next) => {
    let token = req.headers.authorization;
    let { email } = decodeJWT(token);
    let user = await User.findOne({ email }).select("-password -resetToken -resetTokenExpire");
    return res.status(200).json({ message: "User details fetched", user });
};

/*
  >=> check for user role
  >=> if admin return true else false
*/

exports.verifyUser = async (req, res, next) => {
    let token = req.headers.authorization;
    let { role, email } = decodeJWT(token);
    let user = await User.findOne({ email });
    return role.toLowerCase() === "admin" && user
        ? res.status(200).json({ isAdmin: true })
        : res.status(200).json({ isAdmin: false });
};

/*=============================
      POST CONTROLLER
===============================*/

/*
  >=> Save User if form
  >=> fields are valid and send email
  >=> with account activation link to user
*/

exports.signUp = async (req, res, next) => {
    let { password, confirm } = req.body;

    // @return 422 if password and confirm
    // password are not equal
    if (password != confirm) {
        return res.status(422).json({
            message: "Password not matched."
        });
    }

    //create token with expiration date
    let [resetToken, resetTokenExpire] = [getToken, Date.now() + 60 * 60 * 1000 * 24];

    // set token and expire token time on body
    req.body.resetToken = resetToken;
    req.body.resetTokenExpire = resetTokenExpire;

    //save user
    let user = await new User(req.body).save();

    //send mail to user
    await sendTokenToUser({
        host: req.hostname,
        resetToken,
        email: user.email,
        subject: "Account Activation"
    });

    //@return 200 response if above code execute properly
    return res.status(200).json({
        message: "Successfully registered.Check mail for activation link."
    });
};

/*
  >=> Authenticate user if
  >=> provided email and password matched
  >=> and send response back to client with token
*/

exports.signIn = async (req, res, next) => {
    let { email, password } = req.body;

    // find the user with email
    let user = await User.findOne({ email });

    if (user) {
        //@return 422 if user account status is not 1
        if (user.status != 1) {
            return res.status(422).json({
                message: "Please Activate your account."
            });
        }

        // compare user hash with provided password
        let isMatch = bcrypt.compareSync(password, user.password);

        if (isMatch) {
            // create token if password matched
            let token = createJWT({
                id: user._id,
                email: user.email,
                role: user.role
            });

            //@return 200 response if password matched
            return res.status(200).json({
                message: "Authentication Success.",
                token
            });
        }
    }

    //@return 422 if above conditions not passed
    return res.status(422).json({
        message: "Username and Password combination not matched."
    });
};

/*=============================
      DELETE CONTROLLER
===============================*/

/*
  >=> Delete user from db
  >=> by using his/her id
*/

exports.deleteUser = async (req, res, next) => {
    let { id } = req.params;
    let activeUser = decodeJWT(req.headers.authorization);

    // incase active user id and requested id to remove is same
    // return 422 error
    if (activeUser.id === id) return res.status(422).json({ message: "Can't Delete yourself." });

    let user = await User.findByIdAndRemove({ _id: id });
    return res.status(200).json({ message: "One user removed.", user });
};
