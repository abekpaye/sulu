document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById('title').value,
    price: Number(document.getElementById('price').value),
    category: document.getElementById('category').value,
    sizes: document.getElementById('sizes').value.split(',').map(s => s.trim()),
    image: document.getElementById('image').value,
    inStock: document.getElementById('inStock').checked
  };

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('message').innerHTML =
        `<div class="alert alert-success">Product added successfully</div>`;
      e.target.reset();
    } else {
      document.getElementById('message').innerHTML =
        `<div class="alert alert-danger">${data.error}</div>`;
    }

  } catch (error) {
    console.error(error);
  }
});
