const asyncHandler = require("express-async-handler"),
  stripe = require("stripe")(process.env.STRIPE_SECRET),
  orderModel = require("../models/orderModel"),
  cartModel = require("../models/cartModel"),
  productModel = require("../models/productModel"),
  handler = require("./handlerFactory"),
  ApiError = require("../utils/apiError");

// @desc Create category
// @route Post /api/v1/order/:cartId
// @access Private
exports.createCashOrded = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  const taxPrice = 0;
  const shippingPrice = 0;
  console.log(req.params);
  //1- Get Cart by cartId
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(404, `this user don't have a cart`));
  }
  //2- Get order Price from Cart check(coupon or not)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3- Create Order
  const order = await orderModel.create({
    user: cart.user,
    cartItems: cart.cartItems,
    taxPrice: req.body.taxPrice,
    totalOrderPrice,
    shippingAddress,
  });
  if (order) {
    // 4- update product quantity and sold
    const bulkOptions = cart.cartItems.map((item) => ({
      updateMany: {
        filter: { _id: item.product },
        //  $inc operator increments a field by a specified value and has the following form:

        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOptions, {});
    // 5- Clear cart for user
    await cartModel.findByIdAndRemove(req.params.cartId);
  }
  res.status(201).json({ data: order });
});

// @desc Find All Orders
// @route Get /api/v1/order
// @access Private(user,admin,manager)
exports.getAllOrders = handler.getAll(orderModel);

// @desc to get the user all his orders
exports.filterUserOrders = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterData = { user: req.user._id };
  next();
});

// @desc Find One Orders
// @route Get /api/v1/order/:id
// @access Private(admin,manager)
exports.getSpecificOrder = handler.getSpecificOne(orderModel);

// @desc Find All Orders
// @route Put /api/v1/order/:id/paid
// @access Private(admin,manager)
exports.updateOrderIsPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(404, `there is no oreder by this id:${req.params.id}`)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const orderUpdate = await order.save();
  res.status(200).json({ data: orderUpdate });
});

// @desc Find All Orders
// @route Put /api/v1/order/:id/deliverd
// @access Private(admin,manager)
exports.updateOrderIsDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(404, `there is no oreder by this id:${req.params.id}`)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const orderUpdate = await order.save();
  res.status(200).json({ data: orderUpdate });
});

// @desc create Checkout Session
// @route Put /api/v1/order/create-checkout-session/cartId
// @access Private(user)
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  const taxPrice = 0;
  const shippingPrice = 0;

  //1- Get Cart by cartId
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(404, `this user don't have a cart`));
  }
  //2- Get order Price from Cart check(coupon or not)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // stripe checkout sessions
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        // https://stripe.com/docs/api/checkout/sessions/object
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // amount: totalOrderPrice * 100,
        // name: req.user.name,
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },

          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
        // name: req.user.name,
        // currency: "egp",
      },
    ],
    mode: "payment",
    success_url: "http://sitename.com/checkout-success",
    cancel_url: "http://sitename.com/checkout-cancel",

    // req.protocol (http,http) If I want to get the domain I stand on dynamically https://www.udemy.com/
    // success_url: `${req.protocol}://${req.get("host")}/order`,
    // cancel_url: `${req.protocol}//:${req.get("host")}/cart`,
    customer_email: req.user.email,
    // customer_name: req.user.name,
    // client_reference_id: cart._id.toString(),
    client_reference_id: req.params.cartId,
    // This can be useful for storing additional information about the object in a structured format.
    metadata: shippingAddress,
  });
  console.log(shippingAddress);
  // 4- send session
  res.status(200).json({ session });
});
