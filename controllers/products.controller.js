const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongo");

async function getProducts(req, res) {
  try {
    const db = getDB();
    const collection = db.collection("products");

    const {
      name,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
      fields,
      inStock,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    if (name) {
      filter.title = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === "true";
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50); 
    const skip = (pageNum - 1) * limitNum;

    let projection = {};
    if (fields) {
      fields.split(",").forEach(f => {
        projection[f.trim()] = 1;
      });
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    const total = await collection.countDocuments(filter);

    const products = await collection
      .find(filter)
      .project(projection)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .toArray();

      res.json({
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
        data: products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getProductById(req, res) {
  try {
    const db = getDB();
    const product = await db.collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function createProduct(req, res) {
  try {
    const db = getDB();
    const result = await db.collection("products")
      .insertOne(req.body);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
}

async function updateProduct(req, res) {
  try {
    const db = getDB();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
}

async function deleteProduct(req, res) {
  try {
    const db = getDB();

    const result = await db.collection("products").deleteOne({
        _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};