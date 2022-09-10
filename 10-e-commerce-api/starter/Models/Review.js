const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide rating "],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please provide title "],
      maxlength: 100,
    },
    comment: { type: String, required: [true, "please provide review text "] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.statics.calculateAveragerating = async function (productid) {
  const result = await this.aggregate([
    { $match: { product: productid } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);
  //   console.log(result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productid },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numberOfReviews: Math.ceil(result[0]?.numberOfReviews || 0),
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAveragerating(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAveragerating(this.product);
});

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
