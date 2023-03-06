const express = require("express");

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

module.exports = router;
