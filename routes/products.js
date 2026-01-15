const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../database/mongo');

const router = express.Router();

router.post('/', async (req, res) => {
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

module.exports = router;