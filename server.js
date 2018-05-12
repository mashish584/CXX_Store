// use dotenv module for reading .env files
require("dotenv").config({ path: "./secret.env" });

// mongoose connection configuration
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
// use es6 promises
mongoose.Promise = global.Promise;

// get all models
require("./api/models/Product");
require("./api/models/User");
require("./api/models/Category");
require("./api/models/Order");
require("./api/models/Review");

//import app.js
const app = require("./app");

// use port define in secret.env otherwise go with 4040
app.set("port", process.env.PORT || 4040);

app.listen(app.get("port"), () => {
    console.log(`SERVER IS RUNNING ON ${app.get("port")}`);
});
