const categoryModel= require("../models/CategoryModel");
const handler = require('./handlerFactory');
const asyncHandler = require('express-async-handler')
const {createImgMiddleware} = require("../middlewares/imgMiddleware")
// generated id
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

exports.postImageCategory = createImgMiddleware('image')

// @desc Control image category size and quality
// @route Post /api/v1/categories
// @access Private
exports.sharpImageCategory=asyncHandler(async(req,res,next)=>{
    const filename = "category-" + uuidv4() + '-'+ Date.now()  +  ".png" ;
    if (req.file) {
      await sharp(req.file.buffer)
      .resize(320, 320)
      .toFormat('png')
      .png({quality:90})
      .toFile(`uploads/category/${filename}`);
    
    // save image name to DB
    req.body.image = filename
    }
  
next()
})

// @desc Create category
// @route Post /api/v1/categories
// @access Private
exports.postCategory = handler.createHandler(categoryModel);

// @desc Get Specific category
// @route Get /api/v1/categories/:id
// @access Public
exports.specificCategory = handler.getSpecificOne(categoryModel);

// @desc Get all category
// @route Get /api/v1/categories
// @access Public
exports.getCategory = handler.getAll(categoryModel,'Category');

// @desc Update specific category
// @route Put /api/v1/categories/:id
// @access Private
exports.updateCategory = handler.updateHandler(categoryModel);

// @desc Delete specific category
// @route delete /api/v1/categories/:id
// @access Private
exports.deleteCategory = handler.deleteHandler(categoryModel);