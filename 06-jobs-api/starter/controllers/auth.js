const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide info");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credential");
  }
  // compare password
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new UnauthenticatedError("Invalid Credential");
  }
  const token = user.createJwt();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email }, token });
};

// register
const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJwt();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email }, token });
};

module.exports = {
  loginUser,
  registerUser,
};
