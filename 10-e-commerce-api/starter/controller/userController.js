const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../Models/User");
const {
  createToken,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const user = await User.find({}).select("-password").where({ role: "user" });
  //   console.log(user, "name");
  if (!user) {
    throw new NotFoundError("no user role exist");
  }

  res.status(StatusCodes.OK).json({ user });
};
// getsingleuser
const getSingleUser = async (req, res) => {
  const id = await req.params.id;
  //   console.log(id, "singleuser");
  const user = await User.findById(id).select("-password");
  //   console.log(user, "singleuser");
  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
// showCurrentUser
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// updateUser
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError("Pls provide all values");
  }

  const user = await User.findOneAndUpdate(
    { email },
    { email, name },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  const Token = createToken(user);
  attachCookiesToResponse({ res, tokenUser: Token });
  res.status(StatusCodes.OK).json({ user: Token });
};
// updateuserpassword
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Pls provide both values");
  }
  const userId = req.user.id;
  let validUser = await User.findOne({ _id: userId });
  // console.log(validUser, "validUser");
  const validatePassword = await validUser.comparePassword(oldPassword);
  if (!validatePassword) {
    throw new UnauthenticatedError("password does not match");
  }
  validUser.password = newPassword;
  await validUser.save();
  res.status(StatusCodes.OK).json("Password updated");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
