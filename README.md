# E-commerce

## Description
This project is a simple e-commerce web application built with **Node.js** and **Express.js**.  
The main goal of this project is to demonstrate **server-side request handling**, including routing, middleware usage, query and route parameters, form handling, and returning HTML and JSON responses.

The application currently serves static pages and handles basic user interactions without using a database.

---

## Team Members
- Perizat — SE-2429  
- Ayanat — SE-2429  
- Aida — SE-2429  
- Quralai — SE-2429  

---

## Team Member Contributions
- **Perizat** — Prepared and updated the project documentation, including `README.md`, route descriptions, and running instructions.
- **Ayanat** — Implemented server-side routing in Express.js, including query parameters (`/search`) and route parameters (`/item/:id`).
- **Aida** — Worked on `server.js`, developed HTML pages, and ensured consistent navigation between frontend and backend.
- **Quralai** — Implemented contact form handling, server-side validation, and saving submitted data into a JSON file using `fs.writeFile()`.

---

## Project Structure

<pre>
project-root/
├── public/
│ ├── style.css
│ └── images/
│
├── views/
│ ├── index.html
│ ├── about.html
│ ├── cart.html
│ ├── tops.html
│ ├── bottoms.html
│ ├── pyjamas.html
│ ├── best_sellers.html
│ ├── checkout.html
│ └── 404.html
│
├── orders.json
├── server.js
├── package.json
└── README.md
</pre>


---

## Middleware
- `express.urlencoded({ extended: true })` — handles form data
- Custom logger middleware — logs HTTP method and request URL
- `express.static()` — serves static files from the `public` folder

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
  Returns **400 Bad Request** if the parameter is missing.

### Form Handling
- `POST /contact`  
  - Validates input fields  
  - Saves submitted data into `orders.json`  
  - Returns **400 Bad Request** if any field is missing

### JSON Endpoint
- `GET /api/info`  
  Returns project information in JSON format.

---

## Error Handling
- All unknown routes return a custom **404 Page Not Found**

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

