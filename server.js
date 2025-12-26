const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/bottoms', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'bottoms.html'));
});

app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chart.html'));
});

app.get('/pyjamas', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pyjamas.html'));
});

app.get('/tops', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'tops.html'));
});

app.get('/best-sellers', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'best_sellers.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});