const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthenticatedError("unauthorized ");
  }
  const token = authHeaders.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach to the job user
    req.user = { UserId: payload.UserId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("unauthorized ");
  }
};

module.exports = auth;
