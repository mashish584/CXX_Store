const express = require("express");
const router = express.Router();

// import aync error handler
const { catchAsyncError } = require("../handlers/errorHandler");

/*=============================
  PRODUCT MIDDLEWARES IMPORT
===============================*/

const { validateProductForm, validateCategoryForm, validateErrors } = require("../middlewares/validateData.js");

// upload file middleware
const { upload, resize } = require("../middlewares/uploadImage");

/*=============================
  PRODUCT CONTROLLERS IMPORT
===============================*/

const {
    getProducts,
    getRandomProducts,
    getProductsByCategory,
    getProductsBySubCategory,
    getProductById,
    getCategories,
    getCategoriesByType,
    getCategoriesByParent,
    addProduct,
    addCategory,
    updateProductById,
    updateProductImage,
    removeProductById,
    checkout
} = require("../controllers/productController");

/*============================
    PRODUCT - GET ROUTES
==============================*/

//get all products
router.get("", catchAsyncError(getProducts));

// get one product by id
router.get("/:id", catchAsyncError(getProductById));

// get 12 random products
router.get("/:id/random", catchAsyncError(getRandomProducts));

// get products for given category
router.get("/category/parent/:name", catchAsyncError(getProductsByCategory));

// get products for given sub category
router.get("/category/child/:name", catchAsyncError(getProductsBySubCategory));

// get all categories
router.get("/categories/all", catchAsyncError(getCategories));

// get all categories with type
router.get("/categories/all/:type", catchAsyncError(getCategoriesByType));

// get all categories with parent
router.get("/categories/all/child/:parent", catchAsyncError(getCategoriesByParent));

/*============================
    PRODUCT - POST ROUTES
==============================*/

//add product
router.post(
    "/add",
    upload.single("productImage"),
    validateProductForm,
    validateErrors,
    catchAsyncError(resize),
    catchAsyncError(addProduct)
);

// add Category
router.post("/category/add", validateCategoryForm, validateErrors, catchAsyncError(addCategory));

// Products Checkout
router.post("/checkout", catchAsyncError(checkout));

/*============================
    PRODUCT - PUT ROUTES
==============================*/

//Update product
router.put("/:id", validateProductForm, validateErrors, catchAsyncError(updateProductById));

// Update Product Image
router.put("/image/:id", upload.single("productImage"), catchAsyncError(resize), catchAsyncError(updateProductImage));

/*============================
    PRODUCT - DELETE ROUTES
==============================*/

//DELETE product
router.delete("/:id", catchAsyncError(removeProductById));

module.exports = router;
