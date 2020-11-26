const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");

router
  .route("/product")
  .get(productCtrl.getProducts)
  .post(productCtrl.addProduct);

router
  .route("/product/:id")
  .put(productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct);

module.exports = router;
