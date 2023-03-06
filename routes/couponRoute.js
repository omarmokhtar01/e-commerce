const express = require("express");
const {
  ruleCreateCoupon,
  ruleDeleteCoupon,
  ruleGetCoupon,
  ruleUpdateCoupon,
} = require("../utils/validator/coupon");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  postCoupon,
  getCoupon,
  specificCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../Controller/couponServices");

const router = express.Router();
router.use(authProtect, allowedTo("admin", "manager"));
router.route("/").get(getCoupon).post(ruleCreateCoupon, postCoupon);

router
  .route("/:id")
  .get(ruleGetCoupon, specificCoupon)

  .put(ruleUpdateCoupon, updateCoupon)

  .delete(ruleDeleteCoupon, deleteCoupon);

module.exports = router;
