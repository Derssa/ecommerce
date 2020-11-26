const Users = require("../models/userModel");
const Products = require("../models/productModel");
const Orders = require("../models/ordersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const cbOrder = async (session, orderUser) => {
  const newOrder = new Orders({
    userid: orderUser._id,
    orderid: session.id,
    cart: orderUser.cart,
    status: "canceled",
  });
  await newOrder.save();
};

const createOrder = (session) => {
  console.log("Emailing customer", session);
};

const fulfillOrder = async (session) => {
  await Orders.findOneAndUpdate(
    { orderid: session.id },
    {
      shipping: session.shipping,
      status: "Pending Delivery",
    }
  );
  const order = await Orders.findOne({ orderid: session.id });

  await Users.findByIdAndUpdate(order.userid, {
    cart: [],
  });

  order.cart.map(async (ct) => {
    await Products.findOneAndUpdate(
      { _id: ct._id },
      {
        sold: String(parseInt(ct.sold) + ct.quantity),
      }
    );
  });

  console.log("Fulfilling order", session);
};

const emailCustomerAboutFailedPayment = async (session) => {
  await Orders.findOneAndUpdate(
    { orderid: session.id },
    {
      status: "Payment Failed",
    }
  );
  console.log("Emailing customer", session);
};

const userCtrl = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "email already exist." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "password should be at least 6 characters" });

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });

      //res.json({ msg: "register success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "email not found" });

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword)
        return res.status(400).json({ msg: "invalide password" });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logoutUser: (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      res.json({ msg: "logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "please try to login or register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res
            .status(400)
            .json({ msg: "please try to login or register" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
      //res.json({ rf_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  payment: async (req, res) => {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ msg: "please login" });

    const { cart } = user;
    if (!cart.length === 0)
      return res.status(400).json({ msg: "there is no cart" });

    const allCarts = cart.map((c) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: c.title,
          images: [c.images.url],
        },
        unit_amount: c.price * 100,
      },
      quantity: c.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MA"],
      },
      payment_method_types: ["card"],
      line_items: allCarts,
      client_reference_id: String(user._id),
      mode: "payment",
      customer_email: user.email,
      success_url: "http://localhost:3000/history",
      cancel_url: "http://localhost:3000/cart",
    });

    res.json({ id: session.id });
    cbOrder(session, user);
  },
  webhook: async (req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        createOrder(session);
        // Check if the order is paid (e.g., from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Fulfill the purchase...
        fulfillOrder(session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        // Send an email to the customer asking them to retry their order
        emailCustomerAboutFailedPayment(session);

        break;
      }
    }

    res.status(200).json();
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
