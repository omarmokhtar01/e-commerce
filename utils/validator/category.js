const { check,body } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const { default: slugify } = require("slugify")

exports.ruleCreateCategoryValidator=
[
    check('name')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar')
    ,body('name')
    .custom((val,{req})=>{
        req.body.slug = slugify(val);
        return true;

    })
    ,validatorMiddleware
]

exports.ruleGetCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Category Id'),
    validatorMiddleware
]

exports.ruleUpdateCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Category Id')
    .notEmpty()
    .withMessage('Should Not Empty')
    .isString()
    .withMessage('Should be String')
    .isLength({ min: 3 , max: 32})
    .withMessage('Invalid Length Name between 3 , 32 charactar'),
    body('name')
        .optional()
        .custom((val,{req})=>{
        req.body.slug = slugify(val);
        // to continue for next condition
        return true;
    })
    ,validatorMiddleware
]

exports.ruleDeleteCategoryValidator=
[
    check('id')
    .isMongoId()
    .withMessage('Invalid Category Id'),
    validatorMiddleware
]