const mongoose = require('mongoose');

// Create Shcema
const categorySchema= new mongoose.Schema ({
    name: {
        type:String,
        required:[true,"category required"],
        unique:[true,"category is uniqued"],
        minlength:[3,'To short category name'],
        maxlength:[32,'To much category name']
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
        const imgURL = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imgURL;
    }
}


// post middleware: executed after the hooked method after pre middleware have completed.
// after initalized doucument in db return document before response and can be edit 
// @desc To get url image after document saved in DB
// Warnning "init" event/hook is not fired when creating a new Model
// use post middleware mongoose
// @route Post BASE_URL/categories/imgName
// @access Private
categorySchema.post('init',setImgURL);

// @desc To create image with url but url is not saved in DB
// Warnning "save" event/hook is fired when creating a new Model
// use post middleware mongoose
// @route Post BASE_URL/categories/imgName
// @access Private
categorySchema.post('save',setImgURL);

// Create Model
module.exports =  mongoose.model("Category",categorySchema)

/*
Best practice is not save full path to image like abc.com/src/apple.png but saving specific domain path to image.
Ex:
Users image : /user/{id}/avatar/img.png
Product image: /product/{id}/1.png
In this case you avoid sticking images to defined server, server path, url etc.
For example, you will decide to move all your images to another server, 
in this case you don't need to change all records in DB.
*/