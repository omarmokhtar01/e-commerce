const express = require("express");
// const {
//   ruleAddToFavourite,
//   ruleRemoveFromFavourite,
// } = require("../utils/validator/favourite");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  addProductToCart,
  getCartProduct,
  removeProductInCart,
  removeAllInCart,
  updateProductQuantityInCart,
  applyCoupon,
} = require("../Controller/cartServices");

const router = express.Router();

router
  .route("/")
  .post(authProtect, allowedTo("user"), addProductToCart)
  .get(authProtect, allowedTo("user"), getCartProduct)
  .delete(authProtect, allowedTo("user"), removeAllInCart);

router.route("/applyCoupon").put(authProtect, allowedTo("user"), applyCoupon);

router
  .route("/:productId")
  .delete(authProtect, allowedTo("user"), removeProductInCart);

router
  .route("/:itemId")
  .put(authProtect, allowedTo("user"), updateProductQuantityInCart);
// router.delete(
//   "/:productId",
//   authProtect,
//   allowedTo("user"),
//   ruleRemoveFromFavourite,
//   removeProductFromFavourite
// );

module.exports = router;
