const handleAsyncError = require("../middleware/handleAsyncError");
const ErrorHandler = require("./errorHandler");
const User = require("../models/userSchema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendToken = require("./jwtToken");
exports.refreshTokenFun = handleAsyncError(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || refreshToken === undefined) {
    return res.status(401).json({
      errorcode: "SESSION_EXPIRED",
      message: "authentication required",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const hashRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    // console.log(decoded, "decoded");
    const user = await User.findById(decoded?.id);
    if (!user || user.refreshToken !== hashRefreshToken) {
      return res.status(401).json({
        errorcode: "SESSION_EXPIRED",
        message: "athentication required",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error, "error");
  }
});
