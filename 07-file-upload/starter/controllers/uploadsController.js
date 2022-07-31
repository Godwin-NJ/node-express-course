const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomeError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadProductImage = async (req, res) => {
  console.log(req);
  if (!req.files) {
    throw new CustomeError.BadRequestError("No file uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("application")) {
    throw new CustomeError.BadRequestError("Please upload an image");
  }
  const maxSize = 1024 * 1024;
  // this statment isn't correct, using it temporary to test this code
  if (productImage.size > maxSize) {
    throw new CustomeError.BadRequestError("Please upload image less than 1kb");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImageCloud = async (req, res) => {
  // console.log(req.files.image);
  const imageFile = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  console.log(imageFile, "image file");
  res.status(StatusCodes.ACCEPTED).json({ image: imageFile.secure_url });
};

// module.exports = uploadProductImage;
module.exports = uploadProductImageCloud;
