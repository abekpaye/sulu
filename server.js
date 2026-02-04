require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");

const { connectDB } = require("./database/mongo");
const productsRoutes = require("./routes/products");

const app = express();

/*  MIDDLEWARE */

app.use(express.json());

app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, "public")));



const users = [];



app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.userId = user.id;

  res.json({ message: "Login successful" });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sessionId");
    res.json({ message: "Logged out" });
  });
});

/* AUTH MIDDLEWARE */

function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.locals.isAuthenticated = isAuthenticated;



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

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

/* API */

app.use("/api/products", productsRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});



const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log("Server running on port", PORT)
  );
});
