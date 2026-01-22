document.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;

  let category = null;

  if (path === '/tops') category = 'tops';
  if (path === '/bottoms') category = 'bottoms';
  if (path === '/pyjamas') category = 'pyjamas';

  let url = '/api/products';
  if (category) {
    url += `?category=${category}`;
  }

  const res = await fetch(url);
  const products = await res.json();

  renderProducts(products);
});

function renderProducts(products) {
  const container = document.getElementById('products-row');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-2';

    col.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" class="product-image" alt="${product.title}">

        <div class="product-title">${product.title}</div>
        <div class="product-price">${product.price} tg</div>

        <div class="size-container">
          <select class="size-select">
            ${product.sizes.map(s => `<option>${s}</option>`).join('')}
          </select>
        </div>

        <button
          class="btn btn-dark w-100 mt-2 add-to-cart"
          data-id="${product._id}"
          data-title="${product.title}"
          data-price="${product.price}"
        >
          Add to cart
        </button>
      </div>
    `;

    container.appendChild(col);
  });
}