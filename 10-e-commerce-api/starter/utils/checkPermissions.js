const CustomError = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser, "req.user");
  //   console.log(resourceUserId, "user._id");
  //   console.log(typeof resourceUserId, "objectId");
  if (requestUser.admin === "admin") return;
  if (requestUser.id === resourceUserId.toString()) return;
  throw new CustomError.Unauthorized("unauthorized access");
};

module.exports = checkPermissions;
