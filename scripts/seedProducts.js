require("dotenv").config();
const { MongoClient } = require("mongodb");

const products = [
  { title: "Ribbed Longsleeve", price: 12000, category: "tops", sizes: ["S","M","L","XL"], image: "/images/products/12.png", inStock: true },
  { title: "V-Neck Sweater", price: 11000, category: "tops", sizes: ["S","M","L","XL"], image: "/images/products/2.png", inStock: true },
  { title: "Square Neck Top", price: 12000, category: "tops", sizes: ["S","M","L"], image: "/images/products/18.png", inStock: true },
  { title: "Tank Top", price: 9000, category: "tops", sizes: ["S","M","L","XL"], image: "/images/products/14.png", inStock: true },
  { title: "Halter Top", price: 6000, category: "tops", sizes: ["S","M","L"], image: "/images/products/15.png", inStock: false },

  { title: "Wide-Leg Pants", price: 10500, category: "bottoms", sizes: ["S","M","L","XL"], image: "/images/products/7.png", inStock: true },
  { title: "Long Skirt", price: 18000, category: "bottoms", sizes: ["S","M","L"], image: "/images/products/6.png", inStock: true },
  { title: "Home Pants", price: 8000, category: "bottoms", sizes: ["S","M","L","XL"], image: "/images/products/11.png", inStock: true },

  { title: "Cotton Pyjamas Set", price: 15500, category: "pyjamas", sizes: ["S","M","L","XL"], image: "/images/xmas-products/1.png", inStock: true },
  { title: "Plaid Pyjamas Set", price: 15000, category: "pyjamas", sizes: ["S","M","L","XL"], image: "/images/xmas-products/2.png", inStock: true },
  { title: "Satin Pyjamas Set", price: 15000, category: "pyjamas", sizes: ["S","M","L"], image: "/images/xmas-products/5.png", inStock: true },
  { title: "Short Pyjamas Set", price: 12000, category: "pyjamas", sizes: ["S","M","L","XL"], image: "/images/xmas-products/6.png", inStock: false },

  { title: "Cardigan", price: 8000, category: "tops", sizes: ["S","M","L","XL"], image: "/images/products/17.png", inStock: true },
  { title: "Minimal Sweater", price: 10500, category: "tops", sizes: ["S","M","L"], image: "/images/products/13.png", inStock: true },
  { title: "Long Cardigan", price: 15000, category: "tops", sizes: ["S","M","L","XL"], image: "/images/products/8.png", inStock: true },

  { title: "Relaxed Pants", price: 9900, category: "bottoms", sizes: ["S","M","L","XL"], image: "/images/products/7.png", inStock: true },
  { title: "Pleated Skirt", price: 17500, category: "bottoms", sizes: ["S","M","L"], image: "/images/products/6.png", inStock: true },
  { title: "Soft Home Pants", price: 8500, category: "bottoms", sizes: ["S","M","L","XL"], image: "/images/products/11.png", inStock: false },
  { title: "Winter Pyjamas", price: 16500, category: "pyjamas", sizes: ["S","M","L","XL"], image: "/images/xmas-products/1.png", inStock: true },
];

(async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME || "sulu");

  const docs = products.map(p => ({ ...p, createdAt: new Date() }));
  const result = await db.collection("products").insertMany(docs);

  console.log("Inserted:", result.insertedCount);
  const count = await db.collection("products").countDocuments();
  console.log("Total products now:", count);

  await client.close();
})();