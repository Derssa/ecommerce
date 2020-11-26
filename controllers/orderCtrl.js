const Orders = require("../models/ordersModel");

const orderCtrl = {
  getOrder: async (req, res) => {
    try {
      const order = await Orders.find({ userid: req.user.id });
      if (!order) return res.status(400).json({ msg: "there is no orders" });

      res.json({ order });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await Orders.find();
      if (!orders) return res.status(400).json({ msg: "there is no orders" });

      res.json({ orders });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  modifyOrder: async (req, res) => {
    try {
      const { status } = req.body;

      await Orders.findByIdAndUpdate(req.params.id, {
        status,
      });
      res.json({ msg: "status changed" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = orderCtrl;
