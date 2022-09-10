const User = require("../Models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createJWT, attachCookiesToResponse, createToken } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if ((!name, !email, !password)) {
    throw new BadRequestError("empty field");
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new BadRequestError("Email already exist");
  }
  const firstDbUser = (await User.countDocuments({})) === 0;
  const role = firstDbUser ? "admin" : "user";
  const user = await User.create({ name, email, password, role });

  // const tokenUser = {
  //   name: user.name,
  //   email: user.email,
  //   role: user.role,
  //   id: user._id,
  // };
  const tokenUser = createToken(user);

  attachCookiesToResponse({ res, tokenUser });
  // const token = createJWT({ payload: tokenUser });
  // const oneDay = 1000 * 60 * 60 * 24;
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay),
  // });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
  //   res.send("register user");
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("provide empty value");
  }
  const validUser = await User.findOne({ email });
  if (!validUser) {
    throw new UnauthenticatedError("unathorized user");
  }
  const validatePassword = await validUser.comparePassword(password);
  if (!validatePassword) {
    throw new UnauthenticatedError("unathorized user");
  }
  const tokenPayload = createToken(validUser);
  attachCookiesToResponse({ res, tokenUser: tokenPayload });
  res.status(StatusCodes.OK).json({ user: tokenPayload });
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    // 5 * 1000 can be removed to test it immediately
    // expires: new Date(Date.now()),
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user is logged out using cookies" });
};

module.exports = {
  register,
  login,
  logout,
};
