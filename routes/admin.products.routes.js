const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products.controller");

const { validateProduct } = require("../middleware/validateProduct");
const { isAdmin } = require("../middleware/auth");

router.post("/", isAdmin, validateProduct, createProduct);
router.put("/:id", isAdmin, validateProduct, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;