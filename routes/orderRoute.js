const express = require("express");
// const {
//   ruleCreateAddress,
//   ruleRemoveFromFavourite,
// } = require("../utils/validator/address");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  createCashOrded,
  getAllOrders,
  getSpecificOrder,
  filterUserOrders,
  updateOrderIsDelivered,
  updateOrderIsPaid,
  createCheckoutSession,
} = require("../Controller/orderServices");

const router = express.Router();
router.use(authProtect);
router
  .route("/")
  .get(allowedTo("user", "admin", "manager"), filterUserOrders, getAllOrders);

router.get("/:id", allowedTo("user", "admin", "manager"), getSpecificOrder);

router.put(
  "/:id/deliverd",
  allowedTo("admin", "manager"),
  updateOrderIsDelivered
);
router.put("/:id/paid", allowedTo("admin", "manager"), updateOrderIsPaid);

router.post("/:cartId", allowedTo("user"), createCashOrded);
router.post(
  "/create-checkout-session/:cartId",
  allowedTo("user"),
  createCheckoutSession
);

//   .get(authProtect, allowedTo("user"), getMyFavList);

// router.delete(
//   "/:productId",
//   authProtect,
//   allowedTo("user"),
//   ruleRemoveFromFavourite,
//   removeProductFromFavourite
// );

module.exports = router;
