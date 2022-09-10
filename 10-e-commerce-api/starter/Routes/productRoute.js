const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");

const { getSingleProductReviews } = require("../controller/reviewController");
const {
  authenticateUser,
  authorizeUserPermission,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticateUser, authorizeUserPermission("admin"), createProduct)
  .get(getAllProducts);
router
  .route("/uploadImage")
  .post(authenticateUser, authorizeUserPermission("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizeUserPermission("admin"), updateProduct)
  .delete(authenticateUser, authorizeUserPermission("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
