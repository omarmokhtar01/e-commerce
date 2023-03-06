const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc Add Address
// @route Post /api/v1/address
// @access Protect(User)
exports.addNewAddress = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      // addToSet take object have name of array need to add
      $addToSet: {
        addresses: {
          alias: req.body.alias,
          details: req.body.details,
          phone: req.body.phone,
          city: req.body.city,
          postalCode: req.body.postalCode,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    stastus: "successful",
    message: "New Address is added",
    data: user.addresses,
  });
});

// @desc Edite Address
// @route Put /api/v1/address
// @access Protect(User)
exports.editeAddress = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      // set to update element in array
      $set: {
        addresses: {
          alias: req.body.alias,
          details: req.body.details,
          phone: req.body.phone,
          city: req.body.city,
          postalCode: req.body.postalCode,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({ user });
});

// @desc Remove Adress
// @route Delete /api/v1/address
// @access Protect(User)
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      // pull to remove element in array
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  console.log(user);

  res.status(200).json({ message: "Adress is removed", data: user.addresses });
});

// @desc Get All Addresses
// @route Get /api/v1/address
// @access Protect(User)
exports.getAllAddress = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.status(200).json({
    message: "Your all address",
    result: user.addresses.length,
    data: user.addresses,
  });
});
