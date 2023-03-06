const reviewModel = require("../models/reviewModel");
const handler = require("./handlerFactory");

// Nested Route
// Create /api/v1/products/:productId/review
exports.CreateProductIdAndUserIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc Get all Product by categroy id
// Nested Route
// Get /api/v1/products/:productId/review
exports.filteringData = (req, res, next) => {
  let filterData = {};
  if (req.params.productId) filterData = { product: req.params.productId };
  req.filterData = filterData;
  // let filterObj = req.filterData;
  next();
};

// @desc Create review
// @route Post /api/v1/review
// @access Private/Protect/User
exports.postReview = handler.createHandler(reviewModel);

// @desc Get Specific review
// @route Get /api/v1/review/:id
// @access Public
exports.specificReview = handler.getSpecificOne(reviewModel);

// @desc Get all review
// @route Get /api/v1/review
// @access Public
exports.getReview = handler.getAll(reviewModel, "Review");

// @desc Update specific review
// @route Put /api/v1/review/:id
// @access Private/Protect/User
exports.updateReview = handler.updateHandler(reviewModel);

// @desc Delete specific review
// @route delete /api/v1/review/:id
// @access Private/Protect(User-Admin-Manager)
exports.deleteReview = handler.deleteHandler(reviewModel);
