const mongoose= require("mongoose")

const subCategorySchema = new mongoose.Schema(
{
    name:{
        type: String,
        required: [true,"This SubCategory is Required"],
        unique: [true , 'This SubCategory is already exists'],
        trim: true,
        minLength : [2,"The minimum length for this category is 2 charactar"],
        maxLength: [32,"The maximum length for this category is 32 charactar"]
    },
    slug : {
        type: String,
        lowercase: true
    },
    category:{
        type:mongoose.Schema.ObjectId
        ,ref:"Category",
        required:[true, "This SubCategory must belong to parent category"]
    }
},
{
    timestamps:true
})

subCategorySchema.pre(/^find/,function (next) {
    this.populate({path:'category',select:'name-_id'})
    next()
})

module.exports = mongoose.model("SubCategory",subCategorySchema)