require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const { connectDB } = require("./database/mongo");
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sessionId");
    res.json({ message: "Logged out" });
  });
});

function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.locals.isAuthenticated = isAuthenticated;

function requireLoginPage(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

function requireAdminPage(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.redirect("/");
  }
  next();
}


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cart.html"));
});

app.get("/tops", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "tops.html"));
});

app.get("/bottoms", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "bottoms.html"));
});

app.get("/pyjamas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pyjamas.html"));
});

app.get("/best-sellers", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "best_sellers.html"));
});

app.get("/chart", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "chart.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "checkout.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/admin", requireLoginPage, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.use("/api/products", productsRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log("Server running on port", PORT));
});