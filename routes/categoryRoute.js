const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route("/category/:id")
  .put(auth, authAdmin, categoryCtrl.updateCategory)
  .delete(auth, authAdmin, categoryCtrl.deleteCategory);

module.exports = router;
