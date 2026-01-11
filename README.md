# E-commerce

## Description
This project is a simple e-commerce web application built with Node.js and Express.js.
Assignment 2 Part 2 focuses on database integration and implementing a CRUD REST API using a real database.
The application stores and manages data on the server side using SQLite and exposes API endpoints that return JSON responses with correct HTTP status codes.

---

## Project Structure

<pre>
project-root/
├── public/
│ ├── css/
│ ├── images/
│ ├── js/
│ └── favicon.png
│
├── views/
│ ├── index.html
│ ├── about.html
│ ├── cart.html
│ ├── chart.html
│ ├── tops.html
│ ├── bottoms.html
│ ├── pyjamas.html
│ ├── best_sellers.html
│ ├── checkout.html
│ └── 404.html
│
├── database.db
├── db.js
├── orders.json
├── server.js
├── package-lock.json
├── package.json
└── README.md
</pre>


---

## Database
- Database used: SQLite
- Database file: database.db
- The database and table are created automatically when the server starts.

### Table Structure: `items`
| Field | Type | Description |
|-----|-----|------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Item title |
| description | TEXT | Item description |

---

## Routes

### HTML Routes
- `GET /` — Home page
- `GET /about` — About page
- `GET /cart` — Cart page
- `GET /tops` — Tops collection
- `GET /bottoms` — Bottoms collection
- `GET /pyjamas` — Pyjamas collection
- `GET /best-sellers` — Best sellers page
- `GET /checkout` — Checkout page

### Query and Route Parameters
- `GET /search?q=value`  
  Uses a query parameter `q`.  
  Returns **400 Bad Request** if the parameter is missing.

- `GET /item/:id`  
  Uses a route parameter `id`.

### Form Handling
- `POST /contact`
  - Validates input fields
  - Saves submitted data into `orders.json`
  - Returns **400 Bad Request** if any field is missing

### API Routes (CRUD)
- `GET /api/items` — Get all items
- `GET /api/items/:id` — Get item by id
- `POST /api/items` — Create a new item
- `PUT /api/items/:id` — Update an item by id
- `DELETE /api/items/:id` — Delete an item by id

---

## Error Handling
- Unknown HTML routes return a custom **404 Page Not Found** page
- Unknown API routes return a JSON error response

---

## Installation and Run
1. Install dependencies:
npm install
2. Start the server:
node server.js
3. Open in browser:
http://localhost:3000


---

## Technologies Used
- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript
- SQLite
- Bootstrap 5

---

## Team members contributions 
- Perizat: Database setup (SQLite), table design, and automatic database creation.
- Ayanat: CRUD API implementation (GET, POST, PUT, DELETE) and SQL queries.
- Quralai: Server-side validation, error handling, and HTTP status codes.
- Aida: Frontend pages, navigation, 404 handling, and README documentation.