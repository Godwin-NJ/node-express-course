require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressRateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const authRouter = require("./Routes/authRoute");
const userRouter = require("./Routes/userRoutes");
const productRouter = require("./Routes/productRoute");
const ReviewRouter = require("./Routes/reviewRoutes");
const orderRouter = require("./Routes/orderRoutes");
const fileupload = require("express-fileupload");

// middleware import
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// middleware invoke
app.set("trust proxy", 1);
app.use(
  expressRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(cors());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.static("./public"));
app.use(fileupload());

app.get("/", (req, res) => {
  res.send("app setup");
});
// app.get("/api/v1", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("ecommerce setup cookies");
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/orders", orderRouter);

// error middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const startApp = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();

// console.log("E-Commerce API");
