const allowedCategories = ["tops", "bottoms", "pyjamas"];

function validateProduct(req, res, next) {
  const { title, price, category, sizes, image, inStock } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "Invalid title" });
    }
  }

  if (price !== undefined) {
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
  
    req.body.price = numPrice;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
  }

  if (sizes !== undefined) {
    if (!Array.isArray(sizes)) {
      return res.status(400).json({ error: "Invalid sizes" });
    }

    const ok = sizes.every((s) => typeof s === "string" && s.trim().length > 0);
    if (!ok) {
      return res.status(400).json({ error: "Invalid sizes" });
    }
  }

  if (image !== undefined) {
    if (typeof image !== "string") {
      return res.status(400).json({ error: "Invalid image" });
    }
  }

  if (inStock !== undefined) {
    if (typeof inStock !== "boolean") {
      return res.status(400).json({ error: "Invalid inStock" });
    }
  }

  next();
}

module.exports = { validateProduct };