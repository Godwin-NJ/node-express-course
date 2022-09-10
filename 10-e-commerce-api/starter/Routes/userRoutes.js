const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");
const {
  authenticateUser,
  authorizeUserPermission,
} = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizeUserPermission("admin"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
