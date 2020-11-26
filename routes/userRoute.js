const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");

router.post("/register", userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);
router.get("/logout", userCtrl.logoutUser);
router.get("/refresh_token", userCtrl.refreshToken);
router.get("/info", auth, userCtrl.getUser);
router.patch("/addCart", auth, userCtrl.addCart);
router.post("/payment", auth, userCtrl.payment);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  userCtrl.webhook
);

module.exports = router;
