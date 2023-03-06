const { check,body } = require('express-validator');
const { default: slugify } = require('slugify');
const userModel = require("../../models/userModel")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")

exports.ruleSignUpValidator=
[
    // Check Name
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
    }),
    // Check Email
    check('email')
    .notEmpty()
    .withMessage('Email Should Not Empty')
    .isEmail()
    .withMessage('Input should be Email')
    .custom((value) => {
        return userModel.findOne({email : value}).then((user) => {
        if (user) {
            return Promise.reject("E-mail already in use");
        }
        });
    })
    ,
    // Check Password
    check('password')
    .notEmpty()
    .withMessage('Password is Required')
    .isLength({min:6}),
    body('confirmedPassword')
        .exists({checkFalsy: true})
        .withMessage('You must type a confirmation password')
        .custom((value, {req}) => value === req.body.password)
        .withMessage("The passwords do not match")
    ,validatorMiddleware
]

exports.ruleLoginValidator=
[
    // Check Email
    check('email')
    .notEmpty()
    .withMessage('Email Should Not Empty')
    .isEmail()
    .withMessage('Input should be Email'),
    // Check Password
    check('password')
    .notEmpty()
    .withMessage('Password is Required')
    .isLength({min:6})
    ,validatorMiddleware
]