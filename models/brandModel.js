const mongoose = require('mongoose');

// Create Shcema
const brandSchema= new mongoose.Schema ({
    name: {
        type:String,
        required:[true,"brand required"],
        unique:[true,"brand is uniqued"],
        minlength:[3,'To short brand name'],
        maxlength:[32,'To much brand name']
    }
    ,
    slug:{
        type:String,
        lowercase:true
    },
    image: String
},{timestamps:true})

const setImgURL= function(doc) {
    if (doc.image) {
        const imgURL = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imgURL;
        console.log(doc.image);
    }
}


// @desc To get url image after get specific categorry
// Warnning "init" event/hook is not fired when creating a new Model
// use post middleware mongoose
// @route Post BASE_URL/brands/imgName
// @access Private
brandSchema.post('init',setImgURL);

// @desc To create image with url
// Warnning "save" event/hook is fired when creating a new Model
// use post middleware mongoose
// @route Post BASE_URL/brands/imgName
// @access Private
brandSchema.post('save',setImgURL);

// Create Model
module.exports =  mongoose.model("Brand",brandSchema)