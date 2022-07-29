require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

// router
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

//connectD DB
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware
const authMiddleware = require("./middleware/authentication");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(cors());
app.use(xssClean());
app.use(helmet());
app.use(express.json());
// extra packages

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
