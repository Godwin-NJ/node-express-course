const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
} = require("../controllers/productController");
const uploadProductImageCloud = require("../controllers/uploadsController");

router.route("/").post(createProduct).get(getAllProduct);
// router.route("/uploads").post(uploadProductImage);
router.route("/uploads").post(uploadProductImageCloud);

module.exports = router;
