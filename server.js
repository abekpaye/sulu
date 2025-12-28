const express = require('express');
const fs = require('fs');
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


app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).send("Bad Request: query parameter 'q' is missing");
  }

  res.send(`
    <h1>Search Page</h1>
    <p>You searched for: <b>${q}</b></p>
  `);
});



app.get('/item/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("Bad Request: ID is missing");
  }

  res.send(`
    <h1>Item Page</h1>
    <p>Item ID: <b>${id}</b></p>
  `);
});

app.post('/contact', (req, res) => {
  const { firstName, lastName, address, phone, email, paymentMethod } = req.body;

  if (!firstName || !lastName || !address || !phone || !email || !paymentMethod) {
    return res.status(400).send("Bad Request: all fields are required");
  }

  const newOrder = {
    firstName,
    lastName,
    address,
    phone,
    email,
    paymentMethod,
    date: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'orders.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let orders = [];

    if (!err && data) {
      orders = JSON.parse(data);
    }

    orders.push(newOrder);

    fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Server error");
      }

      res.send(`
        <h2>Order received</h2>
        <p>Thank you, ${firstName}. Your order has been saved.</p>
        <a href="/">Back to home</a>
      `);
    });
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
