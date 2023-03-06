const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const productModel = require("../../models/productModel");

exports.ruleAddToFavourite = [
  // Check productId
  check("productId")
    .notEmpty()
    .withMessage("productId Should Not Empty")
    .isMongoId()
    .withMessage("productId is Invalid")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (req.user.role === "user") {
        if (!product) return Promise.reject(new Error("no Product by this id"));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.ruleRemoveFromFavourite = [
  // Check productId
  check("productId").isMongoId().withMessage("productId is Invalid"),

  validatorMiddleware,
];
