const form = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const submitBtn = document.getElementById('submit-btn');
const message = document.getElementById('message');
const editingIdInput = document.getElementById('editingId');

const titleInput = document.getElementById('title');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const sizesInput = document.getElementById('sizes');
const imageInput = document.getElementById('image');
const inStockInput = document.getElementById('inStock');

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  productsList.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'col-md-4';

    div.innerHTML = `
      <div class="card p-3">
        <h5>${p.title}</h5>
        <p>${p.price} tg</p>
        <small>${p.category}</small>

        <div class="mt-2 d-flex gap-2">
          <button class="btn btn-sm btn-outline-dark">Edit</button>
          <button class="btn btn-sm btn-outline-danger">Delete</button>
        </div>
      </div>
    `;

    div.querySelector('.btn-outline-dark')
      .addEventListener('click', () => startEdit(p));

    div.querySelector('.btn-outline-danger')
      .addEventListener('click', () => deleteProduct(p._id));

    productsList.appendChild(div);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    title: titleInput.value,
    price: Number(priceInput.value),
    category: categoryInput.value,
    sizes: sizesInput.value.split(',').map(s => s.trim()),
    image: imageInput.value,
    inStock: inStockInput.checked
  };

  const id = editingIdInput.value;

  if (id) {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    message.innerHTML = `<div class="alert alert-success">Updated</div>`;
  } else {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    message.innerHTML = `<div class="alert alert-success">Added</div>`;
  }

  resetForm();
  loadProducts();
});

function startEdit(p) {
  editingIdInput.value = p._id;

  titleInput.value = p.title;
  priceInput.value = p.price;
  categoryInput.value = p.category;
  sizesInput.value = p.sizes.join(',');
  imageInput.value = p.image;
  inStockInput.checked = p.inStock;

  submitBtn.textContent = 'Save changes';
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  await fetch(`/api/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

function resetForm() {
  form.reset();
  editingIdInput.value = '';
  submitBtn.textContent = 'Add product';
}

loadProducts();
