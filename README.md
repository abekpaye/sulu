# E-commerce API

## Description
This project is a backend REST API developed with Node.js and Express.js as part of Assignment 3 – Part 1.

The goal of this assignment is to design and implement a backend API using MongoDB (native Node.js driver) with full CRUD functionality.  
The API supports filtering, sorting, projection, proper validation, and HTTP status codes.

The project is built on top of the previous Express-based application and now uses MongoDB as the main database.

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
├── database/
│ └── mongo.js
│
├── routes/
│ └── products.js
│
├── server.js
├── package-lock.json
├── package.json
└── README.md
</pre>

---

## Database
- Database used: MongoDB
- Database name: sulu
- Driver: MongoDB native Node.js driver
- Collection: products
- The collection is created automatically on the first insertOne() operation.

### Collection structure: products
| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Product title |
| price | Number | Product price |
| category | String | Product category |
| sizes | Array | Available sizes |
| image | String | Image URL |
| inStock | Boolean | Availability status |
| createdAt | Date | Creation date |

---

## Routes

### API Routes (CRUD)
- GET /api/products — Get all products  
  - Supports filtering, sorting, and projection
- GET /api/products/:id — Get a product by ID
- POST /api/products — Create a new product
- PUT /api/products/:id — Update a product by ID
- DELETE /api/products/:id — Delete a product by ID

### Query Parameters
- Filtering:
  - ?category=value
  - ?inStock=true|false
- Sorting:
  - ?sort=price
  - ?sort=-price
- Projection:
  - ?fields=title,price,category

---

## Error Handling
- 200 OK — Successful GET, PUT, DELETE
- 201 Created — Successful POST
- 400 Bad Request — Invalid ID or missing required fields
- 404 Not Found — Resource not found
- 500 Internal Server Error — Server or database error
- Unknown API routes return a JSON 404 error
- Unknown HTML routes return a custom 404 page

---

## Installation and Run
1. Install dependencies: npm install
2. Make sure MongoDB is running locally: mongodb://127.0.0.1:27017
3. Start the server: node server.js
4. Open in browser: http://localhost:3000


---

## Technologies Used
- Node.js
- Express.js
- MongoDB (native Node.js driver)
- JavaScript

---

## Team members contributions 
- Aida: MongoDB setup, database connection, and data model design.
- Ayanat: CRUD API implementation and route handling.
- Perizat: Query logic (filtering, sorting, projection), validation, and HTTP status codes.
- Quralai: Middleware implementation, application integration, global error handling, and documentation (README).