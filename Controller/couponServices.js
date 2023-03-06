const couponModel = require("../models/couponModel");
const handler = require("./handlerFactory");

// @desc Create Coupon
// @route Post /api/v1/coupon
// @access Private/Admin-Manager
exports.postCoupon = handler.createHandler(couponModel);

// @desc Get Specific Coupon
// @route Get /api/v1/coupon/:id
// @access Private/Admin-Manager
exports.specificCoupon = handler.getSpecificOne(couponModel);

// @desc Get all Coupon
// @route Get /api/v1/coupon
// @access Private/Admin-Manager
exports.getCoupon = handler.getAll(couponModel);

// @desc Update specific Coupon
// @route Put /api/v1/coupon/:id
// @access Private/Admin-Manager
exports.updateCoupon = handler.updateHandler(couponModel);

// @desc Delete specific Coupon
// @route delete /api/v1/coupon/:id
// @access Private/Admin-Manager
exports.deleteCoupon = handler.deleteHandler(couponModel);
