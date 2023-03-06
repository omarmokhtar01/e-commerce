const express = require("express");
const {
  ruleAddToFavourite,
  ruleRemoveFromFavourite,
} = require("../utils/validator/favourite");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  addProductToFavourite,
  removeProductFromFavourite,
  getMyFavList,
} = require("../Controller/favouriteServices");

const router = express.Router();
router;

router
  .route("/")
  .post(
    authProtect,
    allowedTo("user"),
    ruleAddToFavourite,
    addProductToFavourite
  )
  .get(authProtect, allowedTo("user"), getMyFavList);

router.delete(
  "/:productId",
  authProtect,
  allowedTo("user"),
  ruleRemoveFromFavourite,
  removeProductFromFavourite
);

module.exports = router;
