const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongo");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// GET cart
router.get("/cart", isAuthenticated, async (req, res) => {
  const db = getDB();

  const cart = await db.collection("orders").findOne({
    userId: new ObjectId(req.session.userId),
    status: "cart"
  });

  res.json(cart || { items: [] });
});

// ADD to cart
router.post("/cart/add", isAuthenticated, async (req, res) => {
  const db = getDB();
  const { productId } = req.body;

  const product = await db.collection("products").findOne({
    _id: new ObjectId(productId)
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const userId = new ObjectId(req.session.userId);

  let cart = await db.collection("orders").findOne({
    userId,
    status: "cart"
  });

  if (!cart) {
    await db.collection("orders").insertOne({
      userId,
      items: [{
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      }],
      status: "cart",
      createdAt: new Date()
    });

    return res.json({ message: "Cart created" });
  }

  await db.collection("orders").updateOne(
    { _id: cart._id },
    {
      $push: {
        items: {
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      }
    }
  );

  res.json({ message: "Added to cart" });
});

// REMOVE item from cart
router.delete("/cart/remove/:productId", isAuthenticated, async (req, res) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.session.userId);
    const productId = new ObjectId(req.params.productId);

    const cart = await db.collection("orders").findOne({
      userId,
      status: "cart"
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await db.collection("orders").updateOne(
      { _id: cart._id },
      {
        $pull: {
          items: { productId: productId }
        }
      }
    );

    res.json({ message: "Item removed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove failed" });
  }
});


// CHECKOUT
router.post("/checkout", isAuthenticated, async (req, res) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.session.userId);

    const cart = await db.collection("orders").findOne({
      userId,
      status: "cart"
    });

    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Обновляем статус
    await db.collection("orders").updateOne(
      { _id: cart._id },
      { $set: { status: "completed", completedAt: new Date() } }
    );

    // Создаём новый пустой cart
    await db.collection("orders").insertOne({
      userId,
      items: [],
      status: "cart",
      createdAt: new Date()
    });

    res.json({ message: "Order completed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});


module.exports = router;
