const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");
const couponModel = require("../../models/couponModel");
exports.ruleCreateCoupon = [
  // Check name
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name should be string")
    .custom((val) => {
      return couponModel.findOne({ name: val }).then((name) => {
        if (name) return Promise.reject("name of coupon already exist");
      });
    }),
  check("expire")
    .notEmpty()
    .withMessage("expire is required")
    .isISO8601("yyyy-mm-dd")
    .toDate()
    .withMessage("expire should be date yyyy-mm-dd"),
  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("expire should be number"),
  validatorMiddleware,
];

exports.ruleGetCoupon = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  // Check name
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name should be string")
    .custom((val) => {
      return couponModel.findOne({ name: val }).then((name) => {
        if (name) return Promise.reject("name of coupon already exist");
      });
    }),
  check("expire")
    .notEmpty()
    .withMessage("expire is required")
    .isISO8601("yyyy-mm-dd")
    .toDate()
    .withMessage("expire should be date yyyy-mm-dd"),
  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("expire should be  number"),
  validatorMiddleware,
];

exports.ruleUpdateCoupon = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  // Check name
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name should be string")
    .custom((val) => {
      return couponModel.findOne({ name: val }).then((name) => {
        if (name) return Promise.reject("name of coupon already exist");
      });
    }),
  check("expire")
    .notEmpty()
    .withMessage("expire is required")
    .isISO8601("yyyy-mm-dd")
    .toDate()
    .withMessage("expire should be date yyyy-mm-dd"),
  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("expire should be number"),
  validatorMiddleware,
];

exports.ruleDeleteCoupon = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  validatorMiddleware,
];
