require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const { connectDB } = require("./config/mongo");
const { isAdmin } = require("./middleware/auth");

const productsRoutes = require("./routes/products.routes");
const adminProductsRoutes = require("./routes/admin.products.routes");
const authRoutes = require("./routes/auth.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes); 
app.use("/api/admin/products", adminProductsRoutes); 
app.use("/api/orders", ordersRoutes);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "index.html"))
);

app.get("/about", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "about.html"))
);

app.get("/cart", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "cart.html"))
);

app.get("/chart", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "chart.html"))
);

app.get("/checkout", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "checkout.html"))
);

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html"))
);

app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html"))
);

app.get("/admin", isAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, "views", "admin.html"))
);

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sessionId");
    res.json({ message: "Logged out" });
  });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
