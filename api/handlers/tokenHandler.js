const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// get send() method from mailHandler module
const { send } = require("./mailHandler");

// generating token hash
let getHash = crypto.createHmac("sha256", process.env.secret).digest("hex");
let getToken = crypto.randomBytes(20).toString("hex");

//creating JWT token using the getHash
exports.createJWT = payload => {
    return jwt.sign(payload, getHash, {
        expiresIn: 60 * 60 //1hour
    });
};

//decode JWT token by passing the hash String
//generated with same algo and secret
exports.decodeJWT = token => jwt.verify(token, getHash);

//send Token to user mail account
exports.sendTokenToUser = async (data, activation = true) => {
    // prepare message body for mail with token
    let body = `Click to Activate : <a href="http://${data.host}/account/activate/${data.resetToken}">Link</a>`;

    if (!activation) {
        body = `Click to Reset : <a href="http://${data.host}/account/reset/${data.resetToken}">Link</a>`;
    }

    // use send() here to send email to given user

    await send({ mail: data.email, subject: data.subject, body });
};

// export getHash and getToken
exports.getHash = getHash;
exports.getToken = getToken;
