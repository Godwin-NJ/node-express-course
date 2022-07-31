const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

const createProduct = async (req, res) => {
  console.log(req.body);
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
  const allProducts = await Product.find({});
  res.status(StatusCodes.OK).json({ allProducts });
};

module.exports = {
  createProduct,
  getAllProduct,
};
