const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const payment = require("./routes/paymentRoute");
const orderRouter = require("./routes/orderRoute");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// Config
// if (process.env.NODE_ENV !== "production") {
//   // const path = require("path");
//   require("dotenv").config({ path: "backend/config/.env" });
// }

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: ["https://your-personal-shop.vercel.app"],
    origin: [process.env.FRONTEND_URL],
    // origin: ["https://cartico-ew-payw.vercel.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "temp/directory",
  })
);
// routers api's
app.use("/api/ecommerce/v1", productRouter);
app.use("/api/ecommerce/v1", userRouter);
app.use("/api/ecommerce/v1", orderRouter);
app.use("/api/ecommerce/v1", payment);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });
// Middleware for error handling
app.use(errorMiddleware);
module.exports = app;
