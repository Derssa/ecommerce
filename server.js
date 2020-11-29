require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const upload = require("./routes/upload");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const path = require("path");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use((req, res, next) => {
  if (req.originalUrl === "/user/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/user", userRoute);
app.use("/api", categoryRoute);
app.use("/api", upload);
app.use("/api", productRoute);
app.use("/api", orderRoute);

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("db connected");
  }
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server running on port", port);
});
