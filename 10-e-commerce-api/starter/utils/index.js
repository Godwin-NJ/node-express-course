const { createJWT, verifyJWT, attachCookiesToResponse } = require("./jwt");
const createToken = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");

module.exports = {
  createJWT,
  verifyJWT,
  attachCookiesToResponse,
  createToken,
  checkPermissions,
};
