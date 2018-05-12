const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/dist")));

// import handlers
const { catch404Error, reportError } = require("./api/handlers/errorHandler");

// import routes
const productRoute = require("./api/routes/product");
const userRoute = require("./api/routes/user");
const accountRoute = require("./api/routes/account");
const orderRoute = require("./api/routes/order");
const reviewRoute = require("./api/routes/review");
const searchRoute = require("./api/routes/search");

// Cross Origin resource sharing header for allowing
//api connect from different threads
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, site_url"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// register routes with app
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", userRoute);
app.use("/api/account", accountRoute);
app.use("/api/review", reviewRoute);
app.use("/api/search", searchRoute);

// serving index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/dist/index.html"));
});

// use error handlers
app.use(catch404Error);
app.use(reportError);

module.exports = app;
