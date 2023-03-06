const { check,body } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const { default: slugify } = require("slugify")

exports.ruleCreateSubCategoryValidator=
[
    check('name')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 2 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar'),
    check('category')
    .notEmpty()
    .withMessage('subCategory must belong to category')
    .isMongoId()
    .withMessage('Invalid SubCategory Id')
    .custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;

    })
    ,validatorMiddleware
]

exports.ruleGetSubCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory Id'),
    validatorMiddleware
]

exports.ruleUpdateSubCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory Id')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar')
    ,body('name')
    .optional()
    .custom((val,{req})=>{
        req.body.slug = slugify(val);
        // to continue for next condition
        return true
    })
    ,validatorMiddleware
]

exports.ruleDeleteSubCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid SubCategory Id'),
    validatorMiddleware
]