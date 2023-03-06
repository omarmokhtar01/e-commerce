const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.ruleCreateAddress = [
  // Check addresses
  check("addresses.*.alias").isString().withMessage("alias Should be String"),
  check("addresses.*.details")
    .isString()
    .withMessage("details Should be String"),
  check("addresses.*.phone")
    .isMobilePhone("ar-EG")
    .withMessage("phone Should be Egyption Number"),
  check("addresses.*.city").isString().withMessage("alias Should be String"),
  check("addresses.*.postalCode")
    //   5 Digit
    .isPostalCode("DE")
    .withMessage("PostalCode Invalid"),
  validatorMiddleware,
];

exports.ruleGetSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),
  validatorMiddleware,
];

exports.ruleUpdateSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid SubCategory Id")
    .notEmpty()
    .withMessage("Should Not Empty")
    .isString()
    .withMessage("Should be String")
    .isLength({ min: 3, max: 32 })
    .withMessage("Invalid Length Name between 3 , 32 charactar"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      // to continue for next condition
      return true;
    }),
  validatorMiddleware,
];

exports.ruleDeleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),
  validatorMiddleware,
];
