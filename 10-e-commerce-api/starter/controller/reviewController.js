const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const { checkPermissions } = require("../utils");

const Review = require("../Models/Review");
const Product = require("../Models/Product");

// createReview
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new NotFoundError(`No product with Id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.id,
  });
  if (alreadySubmitted) {
    throw new BadRequestError("Review already done");
  }

  req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

// getAllReview
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    model: Product,
    select: "name company price ",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
// getSingleReview
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id : ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
// update review
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id : ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  const { rating, title, comment } = req.body;
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
// delete review
const deleteReview = async (req, res) => {
  // const { rating, title, comment } = req.body;
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id : ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json("OK");
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.findOne({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
