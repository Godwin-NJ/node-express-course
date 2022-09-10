const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Product = require("../Models/Product");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  //   if (!product) {
  //     throw new BadRequestError("");
  //   }
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const allProducts = await Product.find({});
  res.status(StatusCodes.OK).json({ allProducts });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const singleProduct = await Product.findOne({ _id: productId }).populate(
    "reviews"
  );
  if (!singleProduct) {
    throw new NotFoundError(`No product with id:${productId}`);
  }
  res.status(StatusCodes.OK).json({ singleProduct });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`No product with id:${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id:${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "success, product deleted" });
};

const uploadImage = async (req, res) => {
  console.log(req.files, "req.files");
  if (!req.files) {
    throw new BadRequestError("No file found");
  }
  const productImage = req.files.image;
  console.log(productImage, "productImage");
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("File is not an image");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Image is too big");
  }

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
