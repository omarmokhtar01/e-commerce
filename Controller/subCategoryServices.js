const SubCategoryModel = require("../models/subCategoryModel");
const handler = require("./handlerFactory");

// Nested Route
// Create /api/v1/categories/:categoryId/subcategories
exports.CreateSubCategoryToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc Create SubCategory
// @route Post /api/v1/subcategories
// @access Private
exports.postSubCategory = handler.createHandler(SubCategoryModel);

// @desc Get Specific SubCategory
// @route Get /api/v1/subcategories/:id
// @access Public
exports.specificSubCategory = handler.getSpecificOne(SubCategoryModel);

// @desc Get all SubCategory by categroy id
// Nested Route
// Get /api/v1/categories/:categoryId/subcategories
exports.filteringData = (req, res, next) => {
  let filterData = {};
  if (req.params.categoryId) filterData = { category: req.params.categoryId };
  next();
};

// @desc Get all SubCategory
// @route Get /api/v1/subcategories
// @access Public
exports.getAllSubCategory = handler.getAll(SubCategoryModel, "SubCategory");

// @desc Update specific subCategory
// @route Put /api/v1/subcategories/:id
// @access Private

exports.updateSubCategory = handler.updateHandler(SubCategoryModel);

// @desc Delete specific subCategory
// @route delete /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = handler.deleteHandler(SubCategoryModel);
