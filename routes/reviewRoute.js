const express = require("express");
const {
  ruleCreateReview,
  ruleGetReview,
  ruleUpdateReview,
  ruleDeleteBrandValidator,
} = require("../utils/validator/review");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  postReview,
  getReview,
  specificReview,
  updateReview,
  deleteReview,
  filteringData,
  CreateProductIdAndUserIdToBody,
} = require("../Controller/reviewServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filteringData, getReview)

  .post(
    authProtect,
    allowedTo("user"),
    CreateProductIdAndUserIdToBody,
    ruleCreateReview,
    postReview
  );

router
  .route("/:id")
  .get(ruleGetReview, specificReview)

  .put(authProtect, allowedTo("user"), ruleUpdateReview, updateReview)

  .delete(
    authProtect,
    allowedTo("admin", "manager", "user"),
    ruleDeleteBrandValidator,
    deleteReview
  );

module.exports = router;
