const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../database/mongo");
const { validateProduct } = require("../middleware/validateProduct");

const router = express.Router();

// middleware from server.js
function isAuthenticated(req, res, next) {
  return req.app.locals.isAuthenticated(req, res, next);
}


function requireAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const filter = {};

    // inStock
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === "true";
    }

    // category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // title search (name)
    if (req.query.name) {
      filter.title = { $regex: req.query.name, $options: "i" };
    }

    // price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // sorting
    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.order === "desc" ? -1 : 1;
    }

    // projection
    const projection = {};
    if (req.query.fields) {
      req.query.fields.split(",").forEach((field) => {
        projection[field.trim()] = 1;
      });
    }

    const products = await db
      .collection("products")
      .find(filter)
      .sort(sort)
      .project(projection)
      .toArray();

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const db = getDB();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST 

router.post(
  "/",
  isAuthenticated,
  requireAdmin, 
  validateProduct,
  async (req, res) => {
    try {
      const db = getDB();
      const { title, price, category, sizes, image, inStock } = req.body;

      // strict required fields
      if (!title || price === undefined || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const doc = {
        title: String(title).trim(),
        price: Number(price),
        category: String(category).trim(),
        sizes: Array.isArray(sizes) ? sizes : [],
        image: typeof image === "string" ? image : "",
        inStock: typeof inStock === "boolean" ? inStock : true,
        createdAt: new Date(),
      };

      const result = await db.collection("products").insertOne(doc);

      res.status(201).json({
        message: "Product created",
        id: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);


router.put(
  "/:id",
  isAuthenticated,
  requireAdmin, 
  validateProduct,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      // prevent updating _id
      const update = { ...req.body };
      delete update._id;

      // If they send empty body, block it
      if (!update || Object.keys(update).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      // normalize types (optional but clean)
      if (update.price !== undefined) update.price = Number(update.price);
      if (update.title !== undefined) update.title = String(update.title).trim();
      if (update.category !== undefined)
        update.category = String(update.category).trim();
      if (update.image !== undefined) update.image = String(update.image);

      const db = getDB();
      const result = await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// DELETE 
router.delete(
  "/:id",
  isAuthenticated,
  requireAdmin, 
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const db = getDB();
      const result = await db.collection("products").deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
