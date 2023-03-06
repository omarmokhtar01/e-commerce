const express=require('express')
const {
    ruleSignUpValidator,
    ruleLoginValidator
} = require('../utils/validator/authValidate')

const {signup,login,forgotPassword,verifyResetCodePassword,resetPassword} = require("../Controller/authService")


const router=express.Router()



router.route('/signup')
// .get(getUser)
.post(ruleSignUpValidator,signup);

router.route('/login')
// .get(getUser)
.post(ruleLoginValidator,login);

router.post('/forgotpassword',forgotPassword)
router.post('/verify-reset-code',verifyResetCodePassword)
router.post('/resetPassword',resetPassword)



// router.route('/:id')
// .get(specificUser)

// .put(postImageUser,sharpImageUser,updateUser)

// .delete(unActivtedUser)

module.exports = router