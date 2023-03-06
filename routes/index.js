const rateLimit = require("express-rate-limit"),
  routeCategory = require("./categoryRoute"),
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

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 5 minutes)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const mountRoute = (app) => {
  app.use("/api/v1/categories", limiter, routeCategory);
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
