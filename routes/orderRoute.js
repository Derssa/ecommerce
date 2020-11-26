const router = require("express").Router();
const orderCtrl = require("../controllers/orderCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/order", auth, orderCtrl.getOrder);
router.get("/orders", auth, authAdmin, orderCtrl.getOrders);
router.put("/modifyOrder/:id", auth, authAdmin, orderCtrl.modifyOrder);

module.exports = router;
