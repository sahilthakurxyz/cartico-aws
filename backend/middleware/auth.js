const handleAsyncError = require("./handleAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userSchema");
// const isAuthenticatedUser = handleAsyncError(async (req, res, next) => {
//   // const { token } = req.cookies;
//   console.log(req.cookies, "cookies");
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return next(new ErrorHandler("Please login to access this resource", 401));
//   }
//   try {
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     if (Date.now() >= decodedData.exp * 1000) {
//       return next(
//         new ErrorHandler("Your session has expired. Please login again.", 401),
//       );
//     }
//     req.user = await User.findById(decodedData.id);
//     next();
//   } catch (error) {
//     // Handle invalid or expired token errors
//     return next(
//       new ErrorHandler("Invalid Authentication. Please login again.", 401),
//     );
//   }
// });
// New Production Level Auth
const isAuthenticatedUser = handleAsyncError(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decode?.id);
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
});
const authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // 403 server understand the request but not allow to proceed next
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};

module.exports = { isAuthenticatedUser, authoriseRoles };
