// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken();
const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken } = require("./token");

//   //   opton for cookies
//   const option = {
//     expires: new Date(
//       Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };
//   res.status(statusCode).cookie("token", token, option).json({
//     success: true,
//     user,
//     token,
//   });
// };

// module.exports = sendToken;
// old    local storage authentication

// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken(); // Simulate getting the JWT token
//   res.setHeader("Authorization", `Bearer ${token}`);
//   res.status(statusCode).json({
//     success: true,
//     user,
//     token,
//     auth: true,
//   });
// };

const sendToken = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user?._id);
  const refreshToken = generateRefreshToken(user?._id);

  const generateHashToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = generateHashToken;
  await user.save();
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    })
    .status(statusCode)
    .json({
      success: true,
      user,
      token: accessToken,
      auth: true,
    });
};

module.exports = sendToken;
