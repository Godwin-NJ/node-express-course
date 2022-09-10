const mongoose = require("mongoose");
const { Schema } = mongoose;

const singleCartItemSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema(
  {
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number },
    total: { type: Number },
    items: [singleCartItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "delivered", "canceled", "paid"],
      default: "pending",
    },
    clientSecret: { type: String },
    paymentId: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
