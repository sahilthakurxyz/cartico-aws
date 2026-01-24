// Config
// if (process.env.NODE_ENV !== "production") {
//   console.log(process.env.NODE_ENV, "mode");
//   require("dotenv").config({ path: "backend/config/.env" });
// }
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/database.js");
const cloudinary = require("cloudinary");
const app = require("./app.js");
const port = process.env.PORT || 4001;

// Uncaught Error exception
process.on("uncaughtException", (err) => {
  console.log(`Server is Shutting Down due to Unchaught Error,${err.message}`);
  process.exit(1);
});
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`server running on Port :${port}`);
});

// unhandled Promise Rejecton
process.on("unhandledRejection", (err) => {
  console.log(
    `Server is Shutting down due to server Unhandled Promise Rejecton,${err.message}`
  );
  server.close(() => {
    process.exit(1);
  });
});
