const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../database/mongo');

const router = express.Router();

// middleware from server.js
function isAuthenticated(req, res, next) {
  return req.app.locals.isAuthenticated(req, res, next);
}


   //GET ALL PRODUCTS
   
router.get('/', async (req, res) => {
  try {
    const db = getDB();

    const filter = {};

    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }

    // category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // title search
    if (req.query.name) {
      filter.title = { $regex: req.query.name, $options: 'i' };
    }

    // price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }
    }

    // sorting
    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] =
        req.query.order === 'desc' ? -1 : 1;
    }

    // projection
    const projection = {};
    if (req.query.fields) {
      req.query.fields.split(',').forEach(field => {
        projection[field] = 1;
      });
    }

    const products = await db
      .collection('products')
      .find(filter)
      .sort(sort)
      .project(projection)
      .toArray();

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


   //GET PRODUCT BY ID

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const db = getDB();
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, price, category, sizes, image, inStock } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDB();

    const result = await db.collection('products').insertOne({
      title,
      price,
      category,
      sizes: sizes || [],
      image: image || '',
      inStock: inStock ?? true,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Product created',
      id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const db = getDB();

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const db = getDB();

    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
