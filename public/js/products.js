document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(err => {
      console.error('Error loading products:', err);
    });
});

function renderProducts(products) {
  const container = document.getElementById('products-row');
  container.innerHTML = '';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-2';

    col.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-title">${product.title}</div>
        <div class="product-price">${product.price} tg</div>

        <div class="size-container">
          <label>Size:</label>
          <select class="size-select">
            ${product.sizes.map(size => `<option>${size}</option>`).join('')}
          </select>
        </div>

        <button class="add-to-cart-btn"
          data-id="${product._id}">
          Add to Cart
        </button>
      </div>
    `;

    container.appendChild(col);
  });
}
