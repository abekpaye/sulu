const express = require('express');
const path = require('path');
const { connectDB } = require('./database/mongo');
const productsRoutes = require('./routes/products');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(`
    <h1>Assignment 3 – Part 1</h1>
    <p>Backend API with MongoDB</p>
    <ul>
      <li><a href="/api/products">GET /api/products</a></li>
      <li>GET /api/products/:id</li>
      <li>POST /api/products</li>
      <li>PUT /api/products/:id</li>
      <li>DELETE /api/products/:id</li>
    </ul>
  `);
});

app.use('/api/products', productsRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
});