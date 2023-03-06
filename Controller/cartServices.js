const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");

const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc Create Cart
// @route Post /api/v1/cart
// @access Protected('user')
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.body.productId);
  const { productId, quantity, color } = req.body;
  // 1- Get Cart for Logged user
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity: quantity,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    // product exist in cart same(id,color) , update quantity
    const productIndex = cart.cartItems.findIndex(
      // index of product in array
      (item) => item.product.toString() == productId && item.color == color
    );
    // if > -1 product is exist
    if (productIndex > -1) {
      const itemInCart = cart.cartItems[productIndex];
      itemInCart.quantity += quantity;
      cart.cartItems[productIndex] = itemInCart;
    } else {
      // product not exist in cart
      cart.cartItems.push({
        product: productId,
        quantity: quantity,
        color: color,
        price: product.price,
      });
    }
  }
  let totalPrice = 0;
  cart.cartItems.forEach((productItem) => {
    totalPrice += productItem.price * productItem.quantity;
  });
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    message: "product added",
    data: cart,
  });
});

// @desc Get cart for logged user
// @route GEt /api/v1/cart
// @access Protected('user')
exports.getCartProduct = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(404, "Your Cart is Empty"));
  }
  res.status(200).json({
    message: "Your cart",
    numOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

// @desc remove product in Cart
// @route Remove /api/v1/cart/:productId
// @access Protected('user')
exports.removeProductInCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      // pull to remove element in array
      $pull: { cartItems: { _id: req.params.productId } },
    },
    { new: true }
  );
  let totalPrice = 0;
  cart.cartItems.forEach((productItem) => {
    totalPrice += productItem.price * productItem.quantity;
  });
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(204).send();
});

// @desc Remove Cart For User
// @route Remove /api/v1/cart
// @access Protected('user')
exports.removeAllInCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndRemove({ user: req.user._id });
  res.status(204).send();
});

// @desc Update cart product quantity
// @route Put /api/v1/cart
// @access Protected('user')
exports.updateProductQuantityInCart = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(404, `no cart for this id:${req.user._id}`));
  }
  const productIndex = cart.cartItems.findIndex(
    // index of product in array
    (item) => item._id.toString() == req.params.itemId
  );
  // if > -1 item is exist
  if (productIndex > -1) {
    const itemInCart = cart.cartItems[productIndex];
    itemInCart.quantity = quantity;
    cart.cartItems[productIndex] = itemInCart;
  } else {
    return next(
      new ApiError(404, `there is no item for this id: ${req.params.itemId}`)
    );
  }
  let totalPrice = 0;
  cart.cartItems.forEach((productItem) => {
    totalPrice += productItem.price * productItem.quantity;
  });
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    message: "Quantity Updated",
    data: cart,
  });
});

// @desc Apply Coupon to discount cart total price
// @route Put /api/v1/cart
// @access Protected('user')
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  console.log(coupon);
  if (!coupon) {
    return next(new ApiError(404, "Coupon not found"));
  }
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(404, `No Have a Cart for this userId: ${req.user._id}`)
    );
  }
  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  // to back 2 num
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
