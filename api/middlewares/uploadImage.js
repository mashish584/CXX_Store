const multer = require("multer");
const jimp = require("jimp");

const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let multerConfig = {
    storage: multer.memoryStorage(),
    limits: { fileSize: "5000" }
};

exports.upload = multer(multerConfig);

exports.resize = async (req, res, next) => {
    //get file from req
    let { file } = req;

    // if file is not in set send error
    if (!file)
        res.json({
            type: "error",
            errors: { msg: "Please upload image for product." }
        });

    // get mimetype & buffer
    let { mimetype, buffer, originalname } = file;

    // check is file is of image type of not
    let image = mimetype.startsWith("image");
    if (!image) return res.json({ type: "error", errors: { msg: "Invalid Image File." } });

    cloudinary.v2.uploader
        .upload_stream({ resource_type: "raw" }, (error, result) => {
            // set this as a product_img in req.body
            req.body.productImg = result.secure_url;
            next();
        })
        .end(buffer);
};
