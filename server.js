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

app.use('/api/products', productsRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
});