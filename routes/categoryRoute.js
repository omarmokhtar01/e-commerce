const express=require('express')

const {
    ruleCreateCategoryValidator,
    ruleGetCategoryValidator,
    ruleUpdateCategoryValidator,
    ruleDeleteCategoryValidator
} = require('../utils/validator/category')

const {postCategory,
    getCategory,
    specificCategory,
    updateCategory,
    deleteCategory,
    sharpImageCategory,
    postImageCategory
} = require("../Controller/categoryServices")

const {authProtect,allowedTo} = require('../Controller/authService')

const subCategoryRoute = require('./subCategoryRoute')


const router=express.Router()

router.use('/:categoryId/subcategories',subCategoryRoute)

router.route('/')
.get(getCategory)
.post(authProtect
    ,allowedTo('admin','manager')
    ,postImageCategory,sharpImageCategory,ruleCreateCategoryValidator,postCategory)
// if send single file can access by: req.file

router.route('/:id')
.get(ruleGetCategoryValidator,specificCategory)
.put(authProtect
    ,allowedTo('admin','manager')
    ,postImageCategory,sharpImageCategory,ruleUpdateCategoryValidator,updateCategory)
.delete(authProtect
    ,allowedTo('admin','manager')
    ,ruleDeleteCategoryValidator,deleteCategory)





module.exports = router