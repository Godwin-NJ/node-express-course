const { register, login, logout } = require("../controller/authController");
const express = require("express");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
