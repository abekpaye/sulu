const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
  res.send(`<h1>Search</h1><p>You searched for: <b>${q}</b></p>`);
});

app.get('/item/:id', (req, res) => {
  res.send(`<h1>Item</h1><p>Item ID: ${req.params.id}</p>`);
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
      try {
        orders = JSON.parse(data);
      } catch {
        orders = [];
      }
    }

    orders.push(newOrder);

    fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).send("Server error");

      res.status(201).send(`<h2>Order received</h2><a href="/">Back</a>`);
    });
  });
});

/*API CRUD*/

// GET all items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(rows);
  });
});


app.get('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json(row);
  });
});

// POST 
app.post('/api/items', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.run(
    'INSERT INTO items (title, description) VALUES (?, ?)',
    [title, description],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.status(201).json({ id: this.lastID, title, description });
    }
  );
});

// PUT update
app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  if (!title || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.run(
    'UPDATE items SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.status(200).json({ message: 'Item updated' });
    }
  );
});

// DELETE 
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted' });
  });
});

//  404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
