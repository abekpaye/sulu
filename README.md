# E-commerce API

## Description
This project is a backend REST API developed with Node.js and Express.js as part of **Assignment 3 – Part 2**.

The goal of this assignment is to **deploy the application online** and **test CRUD via the website UI (without Postman)**.  
The project includes:
- a deployed Express server,
- MongoDB Atlas connection via environment variables,
- a web interface (pages in `/views`) that consumes the API using `fetch`,
- full CRUD functionality through the **/admin** page.

The API supports filtering, sorting, projection, proper validation, and HTTP status codes.

---

## Live Demo (Render)
Deployed URL: **https://sulu-ku9a.onrender.com**

Useful links:
- Home page: `https://sulu-ku9a.onrender.com/`
- Admin CRUD page: `https://sulu-ku9a.onrender.com/admin`
- API: `https://sulu-ku9a.onrender.com/api/products`
- Repository - `https://github.com/abekpaye/sulu.git`
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
│ ├── admin.html
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
- Database used: MongoDB Atlas
- Database name: sulu
- Driver: MongoDB native Node.js driver
- Collection: products
- The collection is created automatically on the first insertOne() operation.

### Environment variables
This project uses environment variables (Render + local `.env`):
- `MONGO_URI`
- `DB_NAME`

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
  - `?category=value`
  - `?inStock=true|false`
- Sorting:
  - `?sort=price`
  - `?sort=-price`
- Projection:
  - `?fields=title,price,category`

---

## UI Testing (Required in Part 2)
CRUD is tested **through the website UI**, not Postman:
1. Open `/admin`
2. Add a product (Create)
3. Edit a product (Update)
4. Delete a product (Delete)
5. Check the result on `/` and `/api/products`

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

## Installation and Run (Local)
1. Install dependencies: npm installx
2. Create .env file in the project root: 
MONGO_URI=your_mongodb_atlas_uri
DB_NAME=sulu
3. Start the server: node server.js
4. Open in browser:
http://localhost:3000
http://localhost:3000/admin

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
- Quralai: Middleware implementation, create deployment, global error handling, and documentation (README).