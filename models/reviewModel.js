const mongoose = require("mongoose");
const productModel = require("./productModel");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

// show user data => name -withOut id
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

// Aggregation
// Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
reviewSchema.statics.calcAverageReviewAndQuantity = async function (productId) {
  const result = await this.aggregate([
    // stage 1: get all review form spicific product
    {
      $match: { product: productId },
    },
    // Stage 2: Group remaining documents by productId and calculate total quantity and average review
    {
      $group: {
        _id: "product",
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: "$ratings" },
      },
    },
  ]);
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsQuantity: result[0].ratingsQuantity,
      ratingsAverage: result[0].ratingsAverage,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageReviewAndQuantity(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageReviewAndQuantity(this.product);
});
module.exports = mongoose.model("Review", reviewSchema);
