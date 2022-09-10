const { StatusCodes } = require("http-status-codes");
const Order = require("../Models/order");
const { NotFoundError, BadRequestError } = require("../errors");
const Product = require("../Models/Product");
const { checkPermissions } = require("../utils");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "randomvalue";
  return { amount, client_secret };
};
// getallorders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
// getsingleorder
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const singleOrder = await Order.findOne({ _id: orderId });
  if (!singleOrder) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, singleOrder.user);
  res.status(StatusCodes.OK).json({ singleOrder });
};
// getcurrentuserorders
const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.id });
  res.status(StatusCodes.OK).json({ order, count: order.length });
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("please provide tax and shipping fee");
  }

  let orderItem = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No order with product id : ${item.product}`);
    }
    const { name, image, price, amount, _id: productId } = dbProduct;
    // console.log(name, image, price, productId);
    const orderitems = {
      amount: item.amount,
      name,
      image,
      price,
      product: productId,
    };
    orderItem = [...orderItem, orderitems];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeApi({ currency: "usd", amount: total });

  const order = await Order.create({
    total,
    items: orderItem,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
// update Order
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentId = paymentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
