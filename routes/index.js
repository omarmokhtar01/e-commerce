const routeCategory = require("./categoryRoute"),
  routeSubCategory = require("./subCategoryRoute"),
  routeBrand = require("./brandRoute"),
  routeProduct = require("./productRoute"),
  routeUser = require("./userRoute"),
  routeReview = require("./reviewRoute"),
  routeAuth = require("./authRoute"),
  routeFavourite = require("./favouriteRoute"),
  routeAddress = require("./addressRoute"),
  routeCoupon = require("./couponRoute"),
  routeCart = require("./cartRoute"),
  routeOrder = require("./orderRoute");

const mountRoute = (app) => {
  app.use("/api/v1/categories", routeCategory);
  app.use("/api/v1/subcategories", routeSubCategory);
  app.use("/api/v1/brands", routeBrand);
  app.use("/api/v1/products", routeProduct);
  app.use("/api/v1/users", routeUser);
  app.use("/api/v1/auth", routeAuth);
  app.use("/api/v1/review", routeReview);
  app.use("/api/v1/favourite", routeFavourite);
  app.use("/api/v1/address", routeAddress);
  app.use("/api/v1/coupon", routeCoupon);
  app.use("/api/v1/cart", routeCart);
  app.use("/api/v1/order", routeOrder);
};

module.exports = mountRoute;
