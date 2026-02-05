const allowedCategories = ["tops", "bottoms", "pyjamas"];

function validateProduct(req, res, next) {
  const { title, price, category, sizes, image, inStock } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length < 2)) {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return res.status(400).json({ error: "Invalid price" });
  }

  if (category !== undefined && !allowedCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  if (sizes !== undefined && (!Array.isArray(sizes) || sizes.length === 0)) {
    return res.status(400).json({ error: "Invalid sizes" });
  }

  if (image !== undefined && typeof image !== "string") {
    return res.status(400).json({ error: "Invalid image" });
  }

  if (inStock !== undefined && typeof inStock !== "boolean") {
    return res.status(400).json({ error: "Invalid inStock" });
  }

  next();
}

module.exports = { validateProduct };