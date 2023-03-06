const { check,body } = require('express-validator');
const { default: slugify } = require("slugify")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const categoryModel = require('../../models/CategoryModel')
const subCategoryModel = require('../../models/subCategoryModel')


exports.ruleCreateProductValidator=
[
    // Check Title
    check('title')
    .notEmpty()
    .withMessage('title Should Not Empty')
    .isString()
    .withMessage('title Should be String')
    .isLength({ min: 3 , max: 100})
    ,body('title')
    .optional()
    .custom((val,{req})=>{
        req.body.slug = slugify(val)
        // to continue for next condition
        return true
    })
    .withMessage('Invalid Length Title between 3 , 100 charactar'),
    // Check Description
    check('description')
    .notEmpty()
    .withMessage('description Should Not Empty')
    .isString()
    .withMessage('description Should be String')
    .isLength({ min: 20 })
    .withMessage('Invalid Length 20 charactar'),
    // Check Price
    check('price')
    .notEmpty()
    .withMessage('price Should Not Empty')
    .isNumeric()
    .withMessage('Price must be Number')
    .isLength({ max: 200000 })
    .withMessage('Invalid MaxLength 200000 Num'),
    // Check sold
    check('sold')
    .optional()
    .isNumeric()
    .withMessage('Sold must be Number'),
    // Check priceAfterDiscount
    check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage('priceAfterDiscount must be Number')
    .custom((value, { req }) => {
        if (value >= req.body.price) {
        throw new Error('priceAfterDiscount must be lower than price');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    // Check Color
    check('colors')
    .optional()
    .isArray()
    .withMessage('Color is Array'),
    // Check ImageCover
    check('imageCover')
    .notEmpty()
    .withMessage('imageCover Should Not Empty')
    ,
    // Check Images
    check('images')
    .optional()
    .isArray()
    .withMessage('images is Array'),
    // Check Category
    check('category')
    .notEmpty()
    .withMessage('category Should Not Empty')
    .isMongoId()
    .withMessage('Category Invalid Id')
    .custom(value => {
        return categoryModel.findById(value).then(category => {
        if (!category) {
            return Promise.reject('Category ID not found!');
        }
        return true
        });
    }),
    // Check SubCategory
    check('subcategories')
    .optional()
    .isMongoId()
    .withMessage('SubCategory Invalid Id')
    .isArray()
    .custom((subcategoriesIds) =>
        subCategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
            if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
            }
        }
        )
    )
    .custom((val, { req }) =>
        subCategoryModel.find({ category: req.body.category }).then(
        (subcategories) => {
            const subCategoriesIdsDB = [];
            subcategories.forEach((subCategory) => {
                subCategoriesIdsDB.push(subCategory._id.toString());
        });

    // Check if val(subcategory id in req.body) include form subcategorys return from db
    let check = val.every((result)=>subCategoriesIdsDB.includes(result));
    // check all values of an array are equal or not
    let allValues = val.every(val => val === val[0]);    
    if (!check || allValues === true ) {
        return Promise.reject(new Error(`Invalid subcategories Ids belong to Category`));
    }
    })
)
    ,
    // Check Brand
    check('brand')
    .optional()
    .isMongoId()
    .withMessage('Brand Invalid Id'),
    // RatingsAverage
    check('ratingsAverage')
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage('RatingsAverage must be Number')
    .isLength({min:1.0,max:5.0})
    .withMessage('RatingsAverage Length Must be Between 1.0 To 5.0'),
    // ratingsQuantity
    check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity Must be Number')
    .default(0)
    ,validatorMiddleware
]

exports.ruleGetProductValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Product Id'),
    validatorMiddleware
]

exports.ruleUpdateProductValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Product Id')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar')
    ,body('title')
    .optional()
    .custom((val,{req})=>{
        req.body.slug = slugify(val)
        // to continue for next condition
        return true
    })
    ,validatorMiddleware
]

exports.ruleDeleteProductValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Product Id'),
    validatorMiddleware
]