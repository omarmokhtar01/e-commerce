const express=require('express')
const {
    ruleCreateSubCategoryValidator,
    ruleGetSubCategoryValidator,
    ruleUpdateSubCategoryValidator,
    ruleDeleteSubCategoryValidator
} = require('../utils/validator/subCategory')


const {
    postSubCategory,
    getAllSubCategory,
    specificSubCategory,
    updateSubCategory,
    deleteSubCategory,
    CreateSubCategoryToBody,
    filteringData
}= require("../Controller/subCategoryServices")

const {authProtect,allowedTo} = require('../Controller/authService')


// mergeParams: Allow us to access parameters on other routers
const router=express.Router({mergeParams:true})


router.route('/')

.post(authProtect
    ,allowedTo('admin','manager')
    ,CreateSubCategoryToBody,ruleCreateSubCategoryValidator,postSubCategory)
.get(filteringData,getAllSubCategory)

router.route('/:id')
.get(ruleGetSubCategoryValidator,specificSubCategory)
.put(authProtect
    ,allowedTo('admin','manager')
    ,ruleUpdateSubCategoryValidator,updateSubCategory)
.delete(authProtect
    ,allowedTo('admin','manager')
    ,ruleDeleteSubCategoryValidator,deleteSubCategory)

module.exports = router