const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.ruleCreateReview = [
  check("title").optional().isString().withMessage("title Should be String"),
  // Check ratings
  check("ratings")
    .notEmpty()
    .withMessage("ratings Should Not Empty")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("ratings Should be Float between 1 to 5"),
  // Check user
  check("user").isMongoId().withMessage("Invalid user Id"),
  // check product
  check("product")
    .isMongoId()
    .withMessage("Invalid product Id")
    .custom((val, { req }) => {
      return (
        reviewModel
          // check user is logged if make review for spicific product or no
          .findOne({ user: req.user._id, product: req.body.product })
          .then((review) => {
            if (review) return Promise.reject("your review already exists");
          })
      );
    }),
  validatorMiddleware,
];

exports.ruleGetReview = [
  check("id").isMongoId().withMessage("Invalid Review Id"),
  validatorMiddleware,
];

exports.ruleUpdateReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id")
    .custom((val, { req }) => {
      return reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`no review bt this id:${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          // should convert to string because this is objects
          return Promise.reject(new Error("You are not access this review"));
        }
      });
    }),
  check("ratings")
    .notEmpty()
    .withMessage("ratings required")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("ratings Should be Float between 1 to 5"),
  validatorMiddleware,
];

exports.ruleDeleteBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error(`no review bt this id:${val}`));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            // should convert to string because this is objects
            return Promise.reject(new Error("You are not access this review"));
          }
        });
      }
      // not in if condition => admin or manager
      return true;
    }),
  validatorMiddleware,
];
