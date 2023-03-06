const productModel = require("../models/productModel");
const handler = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadMultiImagesMiddleware } = require("../middlewares/imgMiddleware");

exports.sharpImagesProduct = asyncHandler(async (req, res, next) => {
  // 1- to add image cover
  if (req.files.imageCover) {
    const singleImg = req.files["imageCover"][0].buffer;
    const filename =
      "product-" + uuidv4() + "-" + Date.now() + "-cover" + ".png";
    await sharp(singleImg)
      .resize(320, 320)
      .toFormat("png")
      .png({ quality: 90 })
      .toFile(`uploads/product/${filename}`);
    req.body.imageCover = filename;
  }

  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];

    // Promise.all: it must all promises is come true : is back in array
    await Promise.all(
      // map: array method , create new array
      // Syntax map(callBackFunction(Element, Index, Array) { }, thisArg)
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.png`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("png")
          .png({ quality: 95 })
          .toFile(`uploads/product/${imageName}`);
        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});
// fields Accept a mix of files single and array
exports.uploadMixedImgProduct = uploadMultiImagesMiddleware([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
// @desc Create Product
// @route Post /api/v1/categories
// @access Private
exports.postProduct = handler.createHandler(productModel);

// @desc Get Specific Product
// @route Get /api/v1/categories/:id
// @access Public
exports.specificProduct = handler.getSpecificOne(productModel, "reviews");

// @desc Get all Product
// @route Get /api/v1/categories
// @access Public
exports.getProduct = handler.getAll(productModel, "Product");

// @desc Update specific Product
// @route Put /api/v1/product/:id
// @access Private
exports.updateProduct = handler.updateHandler(productModel);

// @desc Delete specific Product
// @route delete /api/v1/product/:id
// @access Private
exports.deleteProduct = handler.deleteHandler(productModel);
