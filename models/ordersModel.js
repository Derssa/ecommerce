const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    orderid: {
      type: String,
      required: true,
      unique: true,
    },
    cart: {
      type: Array,
      required: true,
    },
    shipping: {
      type: Object,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
