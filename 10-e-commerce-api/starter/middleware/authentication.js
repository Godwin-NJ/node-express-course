const CustomErr = require("../errors");
const { verifyJWT } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  // console.log(token, "token");
  if (!token) {
    throw new CustomErr.UnauthenticatedError("Authentication invalid ");
  }

  try {
    const { name, role, id } = verifyJWT({ payload: token });
    //console.log(payload, "payload");
    req.user = { name, role, id };

    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError("Authentication invalid ");
  }
};

const authorizeUserPermission = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.Unauthorized("Unathorized to access this route");
    }
    next();
  };
  // const userRole = req.user.role;
  // if (userRole !== "admin") {
  //   throw new CustomErr.Unauthorized("permission denied");
  // }
  // next();
};

module.exports = { authenticateUser, authorizeUserPermission };
