const express = require("express");
const {
  ruleCreateProductValidator,
  ruleGetProductValidator,
  ruleUpdateProductValidator,
  ruleDeleteProductValidator,
} = require("../utils/validator/product");

const {
  postProduct,
  getProduct,
  specificProduct,
  updateProduct,
  deleteProduct,
  uploadMixedImgProduct,
  sharpImagesProduct,
} = require("../Controller/productServices");

const { authProtect, allowedTo } = require("../Controller/authService");
const reviewRoute = require("./reviewRoute");

const router = express.Router();

// /products/63970e4168a4532beb64ddd8/review
router.use("/:productId/review", reviewRoute);

router
  .route("/")
  .get(getProduct)
  .post(
    authProtect,
    allowedTo("admin", "manager"),
    uploadMixedImgProduct,
    sharpImagesProduct,
    ruleCreateProductValidator,
    postProduct
  );

router
  .route("/:id")
  .get(ruleGetProductValidator, specificProduct)
  .put(
    authProtect,
    allowedTo("admin", "manager"),
    uploadMixedImgProduct,
    sharpImagesProduct,
    ruleUpdateProductValidator,
    updateProduct
  )
  .delete(
    authProtect,
    allowedTo("admin", "manager"),
    ruleDeleteProductValidator,
    deleteProduct
  );

module.exports = router;
