const express = require("express");
const { ruleCreateAddress } = require("../utils/validator/address");

const { authProtect, allowedTo } = require("../Controller/authService");

const {
  addNewAddress,
  editeAddress,
  deleteAddress,
  getAllAddress,
} = require("../Controller/addressServices");

const router = express.Router();
router.use(authProtect, allowedTo("user"));
router.route("/").post(ruleCreateAddress, addNewAddress).get(getAllAddress);

router.route("/:addressId").put(editeAddress).delete(deleteAddress);
module.exports = router;
