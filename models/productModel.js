const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // If you want populate virtuals to show up when using functions
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate from child connected in parent
// such as added in collection new feild reviews and ref Review
productSchema.virtual("reviews", {
  // model name
  ref: "Review",
  //  equal feild name from reviewsModel in here id
  localField: "_id",
  // name of feild in review model
  foreignField: "product",
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name-_id" });
  next();
});

const setImgesURL = function (doc) {
  if (doc.imageCover) {
    const imgURL = `${process.env.BASE_URL}/product/${doc.imageCover}`;
    doc.imageCover = imgURL;
  }

  if (doc.images) {
    let newArr = [];
    doc.images.map((res) => {
      const imgURL = `${process.env.BASE_URL}/product/${res}`;
      newArr.push(imgURL);
    });
    doc.images = newArr;
  }
};

// @route Post BASE_URL/product/imgName
// @access Private
productSchema.post("init", setImgesURL);
productSchema.post("save", setImgesURL);

module.exports = mongoose.model("Product", productSchema);
