const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc Add Product to favourite
// @route Post /api/v1/favourite
// @access Protect(User)
exports.addProductToFavourite = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      // addToSet take object have name of array need to add
      $addToSet: { favourits: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    stastus: "successful",
    message: "Product added to favourit list",
    data: user.favourits,
  });
});

// @desc Remove Product from favourite
// @route Delete /api/v1/favourite
// @access Protect(User)
exports.removeProductFromFavourite = asyncHandler(async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      // pull to remove element in array
      $pull: { favourits: req.params.productId },
    },
    { new: true }
  );
  res.status(204).send();
});

exports.getMyFavList = asyncHandler(async (req, res) => {
  // populate show favourits details like name ...
  const user = await userModel.findById(req.user._id).populate("favourits");

  res.status(200).json({
    message: "Your Favourit list",
    FavouriteNumber: user.favourits.length,
    data: user.favourits,
  });
});
