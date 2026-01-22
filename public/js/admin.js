const form = document.getElementById('product-form');

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  renderProducts(products);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
      title: document.getElementById('title').value,
      price: Number(document.getElementById('price').value),
      category: document.getElementById('category').value,
      sizes: document.getElementById('sizes').value.split(',').map(s => s.trim()),
      image: document.getElementById('image').value,
      inStock: document.getElementById('inStock').checked
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (res.ok) {
      document.getElementById('message').innerHTML =
        `<div class="alert alert-success">Product added successfully</div>`;
      form.reset();
      loadProducts();
    }
  });
}
