const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// export const token = jwt.sign(userInfo, `${process.env.JWT_SECRET}`, {
//   expiresIn: `${process.env.JWT_LIFETIME}`,
// });

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_LIFETIME}`,
  });
  return token;
};

const verifyJWT = ({ payload }) => {
  const validToken = jwt.verify(payload, process.env.JWT_SECRET);
  return validToken;
};

const attachCookiesToResponse = ({ res, tokenUser }) => {
  const userToken = createJWT({ payload: tokenUser });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", userToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createJWT,
  verifyJWT,
  attachCookiesToResponse,
};
