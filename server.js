// 1- core module
const path = require("path");

// 2- serv part modules
require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  compression = require("compression"),
  morgan = require("morgan"),
  hpp = require("hpp"),
  mongoSanitize = require("express-mongo-sanitize"),
  xss = require("xss-clean"),
  toobusy = require("toobusy-js"),
  helmet = require("helmet");

// 3- modules import from folders
const dbConnection = require("./config/database"),
  globalError = require("./middlewares/errMiddleware"),
  ApiError = require("./utils/apiError");

// Routes
const mountRoute = require("./routes"); // ./routes = ./routes/index.js
const { webhookCheckOut } = require("./Controller/orderServices");
// const routeCategory = require("./routes/categoryRoute"),
//   routeSubCategory = require("./routes/subCategoryRoute"),
//   routeBrand = require("./routes/brandRoute"),
//   routeProduct = require("./routes/productRoute"),
//   routeUser = require("./routes/userRoute"),
//   routeReview = require("./routes/reviewRoute"),
//   routeAuth = require("./routes/authRoute"),
//   routeFavourite = require("./routes/favouriteRoute"),
//   routeAddress = require("./routes/addressRoute"),
//   routeCoupon = require("./routes/couponRoute");

// Connect DB
dbConnection();

// Express App
const app = express();

// Enable other domains to access my application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckOut
);

// Middlewares
// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
} else {
  console.log("Production Mode");
}

app.use(express.json({ limit: "20kb" })); // parsing data to convert to json & limit data sending 20kb
app.use(express.static(path.join(__dirname, "/uploads")));
// The middleware search into req.body, req.query and req.params and delete all key than begin with $.
// This is a recursive function, it will call itself each time a JSON is found.
app.use(mongoSanitize());
// to convert script come form body to string
app.use(xss());

// middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "quantity",
      "sold",
      "price",
      "priceAfterDiscount",
      "colors",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// to protect from Dos Attack
app.use(function (req, res, next) {
  if (toobusy()) {
    return new ApiError(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

// Mount Routes
mountRoute(app);
// app.use("/api/v1/categories", limiter, routeCategory);
// app.use("/api/v1/subcategories", routeSubCategory);
// app.use("/api/v1/brands", routeBrand);
// app.use("/api/v1/products", routeProduct);
// app.use("/api/v1/users", routeUser);
// app.use("/api/v1/auth", routeAuth);
// app.use("/api/v1/review", routeReview);
// app.use("/api/v1/favourite", routeFavourite);
// app.use("/api/v1/address", routeAddress);
// app.use("/api/v1/coupon", routeCoupon);

// Error handling route
app.all("*", (req, res, next) => {
  next(new ApiError(400, `Can't find this route ${req.originalUrl}`));
});

// Global Handling Middleware Error for express
app.use(globalError);

// Listenning app
const { PORT } = process.env || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listineng on Port ${PORT}`);
});

// Unhandling rejection Error (Outside Express)
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Error: ${err}`);
  server.close();
  console.log("Shutting down server...");
  toobusy.shutdown();

  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
